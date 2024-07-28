import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const dateFormatTimeZone = (yourDate: Date) => {
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
  return yourDate.toISOString().split("T")[0];
};

Deno.serve(async () => {
  const nowDate = dateFormatTimeZone(new Date());

  const { error } = await supabase.from("bookings")
    .delete()
    .eq(
      "seat_status",
      "reserved",
    ).eq(
      "cancellation_date",
      `${nowDate} 15:50:00+00`,
    );

  if (error) {
    console.error(error);
  }

  return new Response(
    JSON.stringify(true),
    { headers: { "Content-Type": "application/json" } },
  );
});
