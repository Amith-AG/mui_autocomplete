import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  await connectMongoDB();

  const hsn = mongoose.connection.collection("hsn");
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (query) {
    try {
      let results;
      
        results = await hsn.aggregate([
          {
            $search: {
              index: "default",
              text: {
                query: query,
                path: {
                  wildcard: "*"
                }
              }
            }
          }
          ,
          {
            $limit: 5,
          },
          {
            $project: {
              _id: 1,
              htsno: 1,
              description: 1,
              mfn_text_rate: 1,
              score: { $meta: "searchScore" },
            },
          },
        ]);
      
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
