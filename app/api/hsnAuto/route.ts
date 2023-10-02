import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();

  const hsn = mongoose.connection.collection("hsn");
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  query;
  console.log(query);
  console.log(typeof query);

  if (query) {
    try {
      let results;
      if (/^\d+$/.test(query)) {
        results = await hsn.aggregate([
          {
            $search: {
              index: "default",
              compound: {
                must: [
                  {
                    text: {
                      query: query,
                      path: "htsno",
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              htsno: 1,
              description: 1,
             

              score: { $meta: "searchScore" },
            },
          },
        ]);
      } else {
        results = await hsn.aggregate([
          {
            $search: {
              index: "default",
              compound: {
                must: [
                  {
                    text: {
                      query: query,
                      path: "description",
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              htsno: 1,
              description: 1,
             

              score: { $meta: "searchScore" },
            },
          },
        ]);
      }
      results = await results.toArray();
      return NextResponse.json(results);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "An error occurred" });
    }
  } else {
    return NextResponse.json({ error: "Missing hsn parameter" });
  }
}
