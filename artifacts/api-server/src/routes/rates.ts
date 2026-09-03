import { Router, type IRouter } from "express";
import { GetRatesResponse } from "@workspace/api-zod";

type FrankfurterResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

const router: IRouter = Router();
const FRANKFURTER_URL = "https://api.frankfurter.app/latest?to=USD,ILS";

router.get("/rates", async (req, res) => {
  try {
    const upstream = await fetch(FRANKFURTER_URL);

    if (!upstream.ok) {
      req.log.error({ status: upstream.status }, "Frankfurter request failed");
      res.status(502).json({ message: "Rates service is temporarily unavailable." });
      return;
    }

    const data = (await upstream.json()) as FrankfurterResponse;
    const eurToUsd = data.rates.USD;
    const eurToIls = data.rates.ILS;

    if (!eurToUsd || !eurToIls) {
      req.log.error("Frankfurter response was missing USD or ILS");
      res.status(502).json({ message: "Rates service returned incomplete data." });
      return;
    }

    const result = GetRatesResponse.parse({
      usdToIls: eurToIls / eurToUsd,
      eurToIls,
      date: data.date,
      base: data.base,
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Unable to fetch Frankfurter rates");
    res.status(502).json({ message: "Rates service is temporarily unavailable." });
  }
});

export default router;