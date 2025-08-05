import dayjs from "dayjs";
import cron from "node-cron";
import user from "../DB/models/Users.model.js";
import Books from "../DB/models/Booking.model.js";
import { revealDay } from "./send-email.js";

cron.schedule("0 9 * * *", async () => {
  const today = dayjs().startOf("day").toDate();
  const endday = dayjs().endOf("day").toDate();
  const dayBookings = await Books.find({
    date: { $gte: today, $lte: endday },
    isCancled: false,
  });
  for (const book of dayBookings) {
    const userdoc = await user.findById(book.userId);
    if (userdoc?.email) {
      revealDay(
        userdoc.email,
        dayjs(book.date).format("YYYY-MM-DD"),
        book.fullName
      );
    }
  }
});
