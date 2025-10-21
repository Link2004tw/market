import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice"))
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice"))
    : null;
  const available = searchParams.get("available") === "true";

  // Step 1: Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Step 2: Get user's governorate from buyers table
  const { data: buyer, error: buyerError } = await supabaseAdmin
    .from("buyer")
    .select("governorate")
    .eq("uid", user.id)
    //.eq("uid", "550e8400-e29b-41d4-a716-446655440001")
    .single();

  if (buyerError || !buyer) {
    return NextResponse.json(
      { error: "User not found in buyers table" },
      { status: 404 }
    );
  }

  const governorate = buyer.governorate;

  // Step 3: Validate query parameters
  if (category && isNaN(parseInt(category))) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }
  if (
    (minPrice !== null && isNaN(minPrice)) ||
    (maxPrice !== null && isNaN(maxPrice))
  ) {
    return NextResponse.json({ error: "Invalid price range" }, { status: 400 });
  }

  // Step 4: Query products with filters, joining with Locations via sellers
  let query = supabaseAdmin
    .from("product")
    .select(
      `
      pid,
      name,
      price,
      image,
      available,
      description,
      mindays,
      maxdays,
      suid,
      categoryid,
      category (name),
      seller (
        locations (cost)
      )
    `
    )
    .eq("seller.locations.location", governorate);

  // Apply keyword search
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // Apply category filter
  if (category) {
    query = query.eq("categoryid", parseInt(category));
  }

  // Apply price range filters
  if (minPrice !== null) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice !== null) {
    query = query.lte("price", maxPrice);
  }

  // Apply availability filter
  if (available) {
    query = query.gt("available", 0);
  }

  // Execute query
  const { data: products, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: products });
}
