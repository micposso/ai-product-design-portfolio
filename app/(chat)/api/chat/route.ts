import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from "@/ai/actions";
import { generateUUID } from "@/lib/utils";

const MAX_MESSAGES_PER_REQUEST = 20;
const MAX_PROMPT_CHARACTERS = 1500;
const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const REQUESTS_PER_TEN_MINUTES = 10;
const REQUESTS_PER_DAY = 100;

type RateLimitEntry = {
  shortWindowStart: number;
  shortWindowCount: number;
  dayWindowStart: number;
  dayWindowCount: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "anonymous";
  }

  return realIp || "anonymous";
}

function applyRateLimit(ip: string) {
  const now = Date.now();
  const currentEntry = rateLimitStore.get(ip);

  if (!currentEntry) {
    rateLimitStore.set(ip, {
      shortWindowStart: now,
      shortWindowCount: 1,
      dayWindowStart: now,
      dayWindowCount: 1,
    });

    return { allowed: true as const };
  }

  const nextEntry = { ...currentEntry };

  if (now - nextEntry.shortWindowStart >= TEN_MINUTES_IN_MS) {
    nextEntry.shortWindowStart = now;
    nextEntry.shortWindowCount = 0;
  }

  if (now - nextEntry.dayWindowStart >= ONE_DAY_IN_MS) {
    nextEntry.dayWindowStart = now;
    nextEntry.dayWindowCount = 0;
  }

  if (nextEntry.shortWindowCount >= REQUESTS_PER_TEN_MINUTES) {
    return {
      allowed: false as const,
      message: "Too many requests. Please try again in a few minutes.",
    };
  }

  if (nextEntry.dayWindowCount >= REQUESTS_PER_DAY) {
    return {
      allowed: false as const,
      message: "Daily chat limit reached. Please try again tomorrow.",
    };
  }

  nextEntry.shortWindowCount += 1;
  nextEntry.dayWindowCount += 1;
  rateLimitStore.set(ip, nextEntry);

  if (rateLimitStore.size > 5000) {
    for (const [key, value] of rateLimitStore.entries()) {
      const shortWindowExpired =
        now - value.shortWindowStart >= TEN_MINUTES_IN_MS &&
        value.shortWindowCount === 0;
      const dayWindowExpired = now - value.dayWindowStart >= ONE_DAY_IN_MS;

      if (shortWindowExpired || dayWindowExpired) {
        rateLimitStore.delete(key);
      }
    }
  }

  return { allowed: true as const };
}

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const ip = getClientIp(request);
  const rateLimitResult = applyRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return Response.json({ error: rateLimitResult.message }, { status: 429 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES_PER_REQUEST) {
    return Response.json(
      {
        error: `Too many messages in one request. Limit is ${MAX_MESSAGES_PER_REQUEST}.`,
      },
      { status: 400 },
    );
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (
    latestUserMessage &&
    typeof latestUserMessage.content === "string" &&
    latestUserMessage.content.length > MAX_PROMPT_CHARACTERS
  ) {
    return Response.json(
      {
        error: `Message too long. Limit is ${MAX_PROMPT_CHARACTERS} characters.`,
      },
      { status: 400 },
    );
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `\n
        - you help users book flights!
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
        - today's date is ${new Date().toLocaleDateString()}.
        - ask follow up questions to nudge user into the optimal flow
        - ask for any details you don't know, like name of passenger, etc.'
        - C and D are aisle seats, A and F are window seats, B and E are middle seats
        - assume the most popular airports for the origin and destination
        - here's the optimal flow
          - search for flights
          - choose flight
          - select seats
          - create reservation (ask user whether to proceed with payment or change reservation)
          - authorize payment (requires user consent, wait for user to finish payment and let you know when done)
          - display boarding pass (DO NOT display boarding pass without verifying payment)
        '
      `,
    messages: coreMessages,
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      displayFlightStatus: {
        description: "Display the status of a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
          date: z.string().describe("Date of the flight"),
        }),
        execute: async ({ flightNumber, date }) => {
          const flightStatus = await generateSampleFlightStatus({
            flightNumber,
            date,
          });

          return flightStatus;
        },
      },
      searchFlights: {
        description: "Search for flights based on the given parameters",
        parameters: z.object({
          origin: z.string().describe("Origin airport or city"),
          destination: z.string().describe("Destination airport or city"),
        }),
        execute: async ({ origin, destination }) => {
          const results = await generateSampleFlightSearchResults({
            origin,
            destination,
          });

          return results;
        },
      },
      selectSeats: {
        description: "Select seats for a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      createReservation: {
        description: "Display pending reservation details",
        parameters: z.object({
          seats: z.string().array().describe("Array of selected seat numbers"),
          flightNumber: z.string().describe("Flight number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            gate: z.string().describe("Departure gate"),
            terminal: z.string().describe("Departure terminal"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            gate: z.string().describe("Arrival gate"),
            terminal: z.string().describe("Arrival terminal"),
          }),
          passengerName: z.string().describe("Name of the passenger"),
        }),
        execute: async (props) => {
          const { totalPriceInUSD } = await generateReservationPrice(props);
          const id = generateUUID();
          return { id, ...props, totalPriceInUSD };
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize payment, wait for user to repond when they are done",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          return { reservationId };
        },
      },
      verifyPayment: {
        description: "Verify payment status",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          return { hasCompletedPayment: false, reservationId };
        },
      },
      displayBoardingPass: {
        description: "Display a boarding pass",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
          passengerName: z
            .string()
            .describe("Name of the passenger, in title case"),
          flightNumber: z.string().describe("Flight number"),
          seat: z.string().describe("Seat number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            airportName: z.string().describe("Name of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            terminal: z.string().describe("Departure terminal"),
            gate: z.string().describe("Departure gate"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            airportName: z.string().describe("Name of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            terminal: z.string().describe("Arrival terminal"),
            gate: z.string().describe("Arrival gate"),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response("Chat history is disabled", { status: 405 });
}
