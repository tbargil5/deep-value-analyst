import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie,
  ComposedChart,
} from "recharts";
import {
  TrendingUp, TrendingDown, Shield, AlertTriangle, DollarSign, Building2,
  Users, BarChart3, Target, Landmark, Search, Loader2, ArrowUpRight,
  ArrowDownRight, Minus, ChevronDown,
  ChevronRight, Globe, Scale, Zap, Lock,
  Brain, Newspaper, UserCheck, BookOpen, Activity, PieChart as PieIcon,
  Download, Upload, Briefcase, X, Copy, Plus, Waves, MessageCircle, Send,
  FileText, ReceiptText, Wallet,
} from "lucide-react";

// ─── Stock Autocomplete Dataset ──────────────────────────────────────────────
const STOCK_LIST = [
  // Mega-cap Tech
  { t: "AAPL", n: "Apple Inc.", x: "NASDAQ" }, { t: "MSFT", n: "Microsoft Corp.", x: "NASDAQ" },
  { t: "GOOGL", n: "Alphabet Inc. Class A", x: "NASDAQ" }, { t: "GOOG", n: "Alphabet Inc. Class C", x: "NASDAQ" },
  { t: "AMZN", n: "Amazon.com Inc.", x: "NASDAQ" }, { t: "NVDA", n: "NVIDIA Corp.", x: "NASDAQ" },
  { t: "META", n: "Meta Platforms Inc.", x: "NASDAQ" }, { t: "TSLA", n: "Tesla Inc.", x: "NASDAQ" },
  { t: "AVGO", n: "Broadcom Inc.", x: "NASDAQ" }, { t: "ORCL", n: "Oracle Corp.", x: "NYSE" },
  { t: "AMD", n: "Advanced Micro Devices", x: "NASDAQ" }, { t: "INTC", n: "Intel Corp.", x: "NASDAQ" },
  { t: "QCOM", n: "Qualcomm Inc.", x: "NASDAQ" }, { t: "TXN", n: "Texas Instruments", x: "NASDAQ" },
  { t: "AMAT", n: "Applied Materials", x: "NASDAQ" }, { t: "LRCX", n: "Lam Research", x: "NASDAQ" },
  { t: "ASML", n: "ASML Holding NV", x: "NASDAQ" }, { t: "MU", n: "Micron Technology", x: "NASDAQ" },
  { t: "ADBE", n: "Adobe Inc.", x: "NASDAQ" }, { t: "CRM", n: "Salesforce Inc.", x: "NYSE" },
  { t: "NOW", n: "ServiceNow Inc.", x: "NYSE" }, { t: "SNOW", n: "Snowflake Inc.", x: "NYSE" },
  { t: "PLTR", n: "Palantir Technologies", x: "NYSE" }, { t: "UBER", n: "Uber Technologies", x: "NYSE" },
  { t: "ABNB", n: "Airbnb Inc.", x: "NASDAQ" }, { t: "SHOP", n: "Shopify Inc.", x: "NYSE" },
  { t: "SPOT", n: "Spotify Technology", x: "NYSE" }, { t: "NFLX", n: "Netflix Inc.", x: "NASDAQ" },
  { t: "PYPL", n: "PayPal Holdings", x: "NASDAQ" }, { t: "SQ", n: "Block Inc.", x: "NYSE" },
  { t: "COIN", n: "Coinbase Global", x: "NASDAQ" }, { t: "RBLX", n: "Roblox Corp.", x: "NYSE" },
  { t: "U", n: "Unity Software", x: "NYSE" }, { t: "DDOG", n: "Datadog Inc.", x: "NASDAQ" },
  { t: "ZS", n: "Zscaler Inc.", x: "NASDAQ" }, { t: "CRWD", n: "CrowdStrike Holdings", x: "NASDAQ" },
  { t: "PANW", n: "Palo Alto Networks", x: "NASDAQ" }, { t: "NET", n: "Cloudflare Inc.", x: "NYSE" },
  { t: "OKTA", n: "Okta Inc.", x: "NASDAQ" }, { t: "TWLO", n: "Twilio Inc.", x: "NYSE" },
  { t: "MDB", n: "MongoDB Inc.", x: "NASDAQ" }, { t: "GTLB", n: "GitLab Inc.", x: "NASDAQ" },
  { t: "HUBS", n: "HubSpot Inc.", x: "NYSE" }, { t: "WDAY", n: "Workday Inc.", x: "NASDAQ" },
  // Finance
  { t: "BRK.B", n: "Berkshire Hathaway B", x: "NYSE" }, { t: "BRK.A", n: "Berkshire Hathaway A", x: "NYSE" },
  { t: "JPM", n: "JPMorgan Chase", x: "NYSE" }, { t: "BAC", n: "Bank of America", x: "NYSE" },
  { t: "WFC", n: "Wells Fargo", x: "NYSE" }, { t: "GS", n: "Goldman Sachs", x: "NYSE" },
  { t: "MS", n: "Morgan Stanley", x: "NYSE" }, { t: "C", n: "Citigroup Inc.", x: "NYSE" },
  { t: "AXP", n: "American Express", x: "NYSE" }, { t: "V", n: "Visa Inc.", x: "NYSE" },
  { t: "MA", n: "Mastercard Inc.", x: "NYSE" }, { t: "BLK", n: "BlackRock Inc.", x: "NYSE" },
  { t: "SCHW", n: "Charles Schwab", x: "NYSE" }, { t: "COF", n: "Capital One Financial", x: "NYSE" },
  { t: "USB", n: "U.S. Bancorp", x: "NYSE" }, { t: "PNC", n: "PNC Financial Services", x: "NYSE" },
  { t: "TFC", n: "Truist Financial", x: "NYSE" }, { t: "SPGI", n: "S&P Global Inc.", x: "NYSE" },
  { t: "MCO", n: "Moody's Corp.", x: "NYSE" }, { t: "ICE", n: "Intercontinental Exchange", x: "NYSE" },
  { t: "CME", n: "CME Group Inc.", x: "NASDAQ" }, { t: "MSCI", n: "MSCI Inc.", x: "NYSE" },
  // Healthcare
  { t: "UNH", n: "UnitedHealth Group", x: "NYSE" }, { t: "JNJ", n: "Johnson & Johnson", x: "NYSE" },
  { t: "LLY", n: "Eli Lilly and Co.", x: "NYSE" }, { t: "PFE", n: "Pfizer Inc.", x: "NYSE" },
  { t: "ABBV", n: "AbbVie Inc.", x: "NYSE" }, { t: "MRK", n: "Merck & Co.", x: "NYSE" },
  { t: "BMY", n: "Bristol-Myers Squibb", x: "NYSE" }, { t: "AMGN", n: "Amgen Inc.", x: "NASDAQ" },
  { t: "GILD", n: "Gilead Sciences", x: "NASDAQ" }, { t: "BIIB", n: "Biogen Inc.", x: "NASDAQ" },
  { t: "MRNA", n: "Moderna Inc.", x: "NASDAQ" }, { t: "REGN", n: "Regeneron Pharmaceuticals", x: "NASDAQ" },
  { t: "CVS", n: "CVS Health Corp.", x: "NYSE" }, { t: "CI", n: "Cigna Group", x: "NYSE" },
  { t: "HUM", n: "Humana Inc.", x: "NYSE" }, { t: "TMO", n: "Thermo Fisher Scientific", x: "NYSE" },
  { t: "DHR", n: "Danaher Corp.", x: "NYSE" }, { t: "MDT", n: "Medtronic plc", x: "NYSE" },
  { t: "BSX", n: "Boston Scientific", x: "NYSE" }, { t: "SYK", n: "Stryker Corp.", x: "NYSE" },
  { t: "ZTS", n: "Zoetis Inc.", x: "NYSE" }, { t: "ISRG", n: "Intuitive Surgical", x: "NASDAQ" },
  { t: "EW", n: "Edwards Lifesciences", x: "NYSE" }, { t: "DXCM", n: "DexCom Inc.", x: "NASDAQ" },
  // Consumer
  { t: "WMT", n: "Walmart Inc.", x: "NYSE" }, { t: "COST", n: "Costco Wholesale", x: "NASDAQ" },
  { t: "TGT", n: "Target Corp.", x: "NYSE" }, { t: "HD", n: "Home Depot", x: "NYSE" },
  { t: "LOW", n: "Lowe's Companies", x: "NYSE" }, { t: "MCD", n: "McDonald's Corp.", x: "NYSE" },
  { t: "SBUX", n: "Starbucks Corp.", x: "NASDAQ" }, { t: "NKE", n: "Nike Inc.", x: "NYSE" },
  { t: "DIS", n: "Walt Disney Co.", x: "NYSE" }, { t: "CMCSA", n: "Comcast Corp.", x: "NASDAQ" },
  { t: "YUM", n: "Yum! Brands", x: "NYSE" }, { t: "CMG", n: "Chipotle Mexican Grill", x: "NYSE" },
  { t: "DPZ", n: "Domino's Pizza", x: "NYSE" }, { t: "AMZN", n: "Amazon.com Inc.", x: "NASDAQ" },
  { t: "EBAY", n: "eBay Inc.", x: "NASDAQ" }, { t: "ETSY", n: "Etsy Inc.", x: "NASDAQ" },
  { t: "LULU", n: "Lululemon Athletica", x: "NASDAQ" }, { t: "ROST", n: "Ross Stores", x: "NASDAQ" },
  { t: "TJX", n: "TJX Companies", x: "NYSE" }, { t: "KO", n: "Coca-Cola Co.", x: "NYSE" },
  { t: "PEP", n: "PepsiCo Inc.", x: "NASDAQ" }, { t: "MO", n: "Altria Group", x: "NYSE" },
  { t: "PM", n: "Philip Morris International", x: "NYSE" }, { t: "PG", n: "Procter & Gamble", x: "NYSE" },
  { t: "CL", n: "Colgate-Palmolive", x: "NYSE" }, { t: "KMB", n: "Kimberly-Clark", x: "NYSE" },
  // Energy
  { t: "XOM", n: "Exxon Mobil Corp.", x: "NYSE" }, { t: "CVX", n: "Chevron Corp.", x: "NYSE" },
  { t: "COP", n: "ConocoPhillips", x: "NYSE" }, { t: "EOG", n: "EOG Resources", x: "NYSE" },
  { t: "SLB", n: "SLB (Schlumberger)", x: "NYSE" }, { t: "PSX", n: "Phillips 66", x: "NYSE" },
  { t: "VLO", n: "Valero Energy", x: "NYSE" }, { t: "MPC", n: "Marathon Petroleum", x: "NYSE" },
  { t: "OXY", n: "Occidental Petroleum", x: "NYSE" }, { t: "HAL", n: "Halliburton Co.", x: "NYSE" },
  { t: "BP", n: "BP p.l.c.", x: "NYSE" }, { t: "SHEL", n: "Shell plc", x: "NYSE" },
  // Industrial
  { t: "CAT", n: "Caterpillar Inc.", x: "NYSE" }, { t: "DE", n: "Deere & Company", x: "NYSE" },
  { t: "BA", n: "Boeing Co.", x: "NYSE" }, { t: "RTX", n: "RTX Corp.", x: "NYSE" },
  { t: "LMT", n: "Lockheed Martin", x: "NYSE" }, { t: "NOC", n: "Northrop Grumman", x: "NYSE" },
  { t: "GD", n: "General Dynamics", x: "NYSE" }, { t: "HON", n: "Honeywell International", x: "NASDAQ" },
  { t: "MMM", n: "3M Company", x: "NYSE" }, { t: "EMR", n: "Emerson Electric", x: "NYSE" },
  { t: "ETN", n: "Eaton Corp.", x: "NYSE" }, { t: "ITW", n: "Illinois Tool Works", x: "NASDAQ" },
  { t: "GE", n: "GE Aerospace", x: "NYSE" }, { t: "UPS", n: "United Parcel Service", x: "NYSE" },
  { t: "FDX", n: "FedEx Corp.", x: "NYSE" }, { t: "CSX", n: "CSX Corp.", x: "NASDAQ" },
  { t: "NSC", n: "Norfolk Southern", x: "NYSE" }, { t: "UNP", n: "Union Pacific", x: "NYSE" },
  // Telecom
  { t: "T", n: "AT&T Inc.", x: "NYSE" }, { t: "VZ", n: "Verizon Communications", x: "NYSE" },
  { t: "TMUS", n: "T-Mobile US", x: "NASDAQ" },
  // Real Estate
  { t: "AMT", n: "American Tower", x: "NYSE" }, { t: "PLD", n: "Prologis Inc.", x: "NYSE" },
  { t: "EQIX", n: "Equinix Inc.", x: "NASDAQ" }, { t: "CCI", n: "Crown Castle Inc.", x: "NYSE" },
  { t: "SPG", n: "Simon Property Group", x: "NYSE" }, { t: "O", n: "Realty Income Corp.", x: "NYSE" },
  // Materials
  { t: "LIN", n: "Linde plc", x: "NASDAQ" }, { t: "APD", n: "Air Products & Chemicals", x: "NASDAQ" },
  { t: "FCX", n: "Freeport-McMoRan", x: "NYSE" }, { t: "NEM", n: "Newmont Corp.", x: "NYSE" },
  { t: "NUE", n: "Nucor Corp.", x: "NYSE" }, { t: "AA", n: "Alcoa Corp.", x: "NYSE" },
  // ETFs
  { t: "SPY", n: "SPDR S&P 500 ETF", x: "NYSE" }, { t: "QQQ", n: "Invesco QQQ Trust", x: "NASDAQ" },
  { t: "IWM", n: "iShares Russell 2000 ETF", x: "NYSE" }, { t: "VTI", n: "Vanguard Total Stock Market ETF", x: "NYSE" },
  { t: "VOO", n: "Vanguard S&P 500 ETF", x: "NYSE" }, { t: "VEA", n: "Vanguard FTSE Dev Markets ETF", x: "NYSE" },
  { t: "VWO", n: "Vanguard FTSE Emerging Markets ETF", x: "NYSE" }, { t: "AGG", n: "iShares Core US Aggregate Bond ETF", x: "NYSE" },
  { t: "BND", n: "Vanguard Total Bond Market ETF", x: "NASDAQ" }, { t: "GLD", n: "SPDR Gold Shares", x: "NYSE" },
  { t: "XLK", n: "Technology Select Sector SPDR", x: "NYSE" }, { t: "XLF", n: "Financial Select Sector SPDR", x: "NYSE" },
  { t: "XLE", n: "Energy Select Sector SPDR", x: "NYSE" }, { t: "XLV", n: "Health Care Select Sector SPDR", x: "NYSE" },
  { t: "ARKK", n: "ARK Innovation ETF", x: "NYSE" }, { t: "DIA", n: "SPDR Dow Jones ETF", x: "NYSE" },
  { t: "IVV", n: "iShares Core S&P 500 ETF", x: "NYSE" }, { t: "TLT", n: "iShares 20+ Year Treasury Bond ETF", x: "NASDAQ" },
];

// ─── Types ───────────────────────────────────────────────────────────────────
interface AnalysisData {
  ticker: string;
  lastUpdated: string;
  overview: {
    name: string; sector: string; industry: string; exchange: string;
    marketCap: number; employees: number; description: string;
    ceo: string; country: string; ipoDate: string; website: string;
  };
  price: {
    current: number; change: number; changePct: number;
    ytd: number; oneYear: number; fiveYear: number;
    allTimeHigh: number; athDate: string; fiftyTwoHigh: number; fiftyTwoLow: number;
    beta: number;
  };
  valuation: {
    peRatio: number; forwardPE: number; evEbitda: number; priceToBook: number;
    pegRatio: number; priceSales: number; evRevenue: number;
    historicalPE5y: number; historicalEvEbitda5y: number;
  };
  quality: {
    roic: number; roic3yAvg: number; roe: number; roa: number;
    fcfYield: number; earningsYield: number;
    revenueCAGR3y: number; epsCAGR3y: number; fcfCAGR3y: number;
  };
  moat: {
    grossMargins: { year: string; margin: number }[];
    operatingMargins: { year: string; margin: number }[];
    netMargins: { year: string; margin: number }[];
    switchingCosts: string; networkEffects: string; pricingPower: string;
    intangibles: string; costAdvantage: string;
    moatRating: "Wide" | "Narrow" | "None";
  };
  capital: {
    buybackYield: number; dividendYield: number; payoutRatio: number;
    retentionRatio: number; sharesOutstanding: { year: string; shares: number }[];
    totalShareholderYield: number;
  };
  solvency: {
    netDebtEbitda: number; interestCoverage: number; currentRatio: number;
    quickRatio: number; debtToEquity: number;
    cashAndEquivalents: number; totalDebt: number;
    canSurvive24mo: boolean;
  };
  dcf: {
    intrinsicValue: number; upside: number;
    wacc: number; terminalGrowth: number;
    marginOfSafety: "Undervalued" | "Fairly Valued" | "Overvalued";
  };
  peers: {
    name: string; ticker: string; pe: number; evEbitda: number;
    roic: number; revenueGrowth: number; marketCap: number;
  }[];
  insiders: {
    name: string; title: string; type: string; shares: number;
    value: number; date: string;
  }[];
  institutions: {
    holder: string; shares: number; change: number; date: string;
  }[];
  congress: {
    politician: string; chamber: string; type: string;
    amount: string; date: string;
  }[];
  analyst: {
    consensus: string; priceTarget: number; targetUpside: number;
    buy: number; hold: number; sell: number;
  };
  esg: {
    total: number; environmental: number; social: number; governance: number;
    rating: string;
  };
  transcriptInsights: string[];
  news: { title: string; date: string; url: string; sentiment: string }[];
  revenueSegments: { segment: string; revenue: number; pct: number }[];
  geoSegments: { region: string; revenue: number; pct: number }[];
  financialHistory: {
    year: string; revenue: number; netIncome: number; fcf: number;
    eps: number; dividend: number;
  }[];
  macroSensitivity: {
    factors: {
      name: string;
      direction: "Tailwind" | "Headwind" | "Neutral";
      impact: "High" | "Medium" | "Low";
      currentTrend: string;
      transmissionChannel: string;
    }[];
    overallMacroRisk: "Low" | "Moderate" | "Elevated" | "High";
    macroSummary: string;
    rippleEffects: { event: string; directEffect: string; secondaryImpact: string }[];
  };
  statements: {
    income: {
      year: string; revenue: number; cogs: number; grossProfit: number;
      rd: number; sga: number; operatingIncome: number; ebitda: number;
      netIncome: number; eps: number; sharesBasic: number; interestExpense: number;
      taxRate: number; grossMargin: number; operatingMargin: number; netMargin: number;
    }[];
    balance: {
      year: string; cash: number; receivables: number; inventory: number;
      currentAssets: number; ppe: number; goodwill: number; intangibles: number;
      totalAssets: number; currentLiabilities: number; longTermDebt: number;
      totalLiabilities: number; totalEquity: number; retainedEarnings: number; bookValue: number;
    }[];
    cashflow: {
      year: string; operatingCF: number; capex: number; freeCashFlow: number;
      acquisitions: number; dividendsPaid: number; buybacks: number;
      debtIssuance: number; debtRepayment: number; netChange: number;
    }[];
  };
  bullCase: string[];
  bearCase: string[];
  risks: string[];
  catalysts: string[];
  verdict: {
    rating: "STRONG ACCUMULATE" | "ACCUMULATE" | "HOLD" | "WATCHLIST" | "AVOID";
    summary: string;
    positionGuidance: string;
  };
}

interface PortfolioItem {
  ticker: string;
  data: AnalysisData;
  addedDate: string;
  notes: string;
}

// ─── Demo data ──────────────────────────────────────────────────────────────
const DEMO_DATA: AnalysisData = {
  ticker: "AAPL",
  lastUpdated: "2026-04-03 09:30 ET",
  overview: {
    name: "Apple Inc.", sector: "Technology", industry: "Consumer Electronics",
    exchange: "NASDAQ", marketCap: 3420000000000, employees: 164000,
    description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    ceo: "Tim Cook", country: "US", ipoDate: "1980-12-12", website: "apple.com"
  },
  price: {
    current: 223.45, change: 2.31, changePct: 1.04,
    ytd: 8.2, oneYear: 22.5, fiveYear: 185.3,
    allTimeHigh: 259.81, athDate: "2024-12-26", fiftyTwoHigh: 260.10, fiftyTwoLow: 169.21,
    beta: 1.24
  },
  valuation: {
    peRatio: 33.8, forwardPE: 28.5, evEbitda: 25.2, priceToBook: 52.1,
    pegRatio: 2.8, priceSales: 8.7, evRevenue: 8.9,
    historicalPE5y: 28.4, historicalEvEbitda5y: 22.1
  },
  quality: {
    roic: 58.2, roic3yAvg: 55.8, roe: 160.9, roa: 28.3,
    fcfYield: 3.1, earningsYield: 2.96,
    revenueCAGR3y: 4.8, epsCAGR3y: 9.2, fcfCAGR3y: 7.1
  },
  moat: {
    grossMargins: [
      { year: "2021", margin: 41.8 }, { year: "2022", margin: 43.3 },
      { year: "2023", margin: 44.1 }, { year: "2024", margin: 46.2 }, { year: "2025", margin: 46.9 }
    ],
    operatingMargins: [
      { year: "2021", margin: 29.8 }, { year: "2022", margin: 30.3 },
      { year: "2023", margin: 29.8 }, { year: "2024", margin: 31.5 }, { year: "2025", margin: 32.1 }
    ],
    netMargins: [
      { year: "2021", margin: 25.9 }, { year: "2022", margin: 25.3 },
      { year: "2023", margin: 25.3 }, { year: "2024", margin: 26.4 }, { year: "2025", margin: 27.0 }
    ],
    switchingCosts: "Very High — deep ecosystem lock-in (iCloud, Apple ID, AirDrop, iMessage, App Store purchases)",
    networkEffects: "Moderate — App Store developer ecosystem, iMessage social pressure",
    pricingPower: "Strong — consistent ASP increases with minimal volume erosion",
    intangibles: "Exceptional — brand value #1 globally, design patents, proprietary silicon",
    costAdvantage: "Growing — vertical integration (M-series chips) reducing BOM and boosting margins",
    moatRating: "Wide"
  },
  capital: {
    buybackYield: 3.8, dividendYield: 0.44, payoutRatio: 15.0,
    retentionRatio: 85.0,
    sharesOutstanding: [
      { year: "2020", shares: 17001 }, { year: "2021", shares: 16426 },
      { year: "2022", shares: 15943 }, { year: "2023", shares: 15461 },
      { year: "2024", shares: 15115 }, { year: "2025", shares: 14920 }
    ],
    totalShareholderYield: 4.24
  },
  solvency: {
    netDebtEbitda: 0.4, interestCoverage: 29.2, currentRatio: 0.87,
    quickRatio: 0.83, debtToEquity: 1.87,
    cashAndEquivalents: 65000000000, totalDebt: 98000000000,
    canSurvive24mo: true
  },
  dcf: {
    intrinsicValue: 198.50, upside: -11.2,
    wacc: 9.8, terminalGrowth: 3.0,
    marginOfSafety: "Overvalued"
  },
  peers: [
    { name: "Microsoft", ticker: "MSFT", pe: 34.2, evEbitda: 24.8, roic: 32.1, revenueGrowth: 15.2, marketCap: 3100000000000 },
    { name: "Alphabet", ticker: "GOOGL", pe: 22.1, evEbitda: 16.3, roic: 28.5, revenueGrowth: 13.8, marketCap: 2100000000000 },
    { name: "Samsung", ticker: "005930.KS", pe: 18.5, evEbitda: 8.2, roic: 8.1, revenueGrowth: 6.2, marketCap: 340000000000 },
    { name: "Meta", ticker: "META", pe: 24.8, evEbitda: 17.1, roic: 25.4, revenueGrowth: 21.5, marketCap: 1500000000000 }
  ],
  insiders: [
    { name: "Tim Cook", title: "CEO", type: "Sale", shares: 50000, value: 11172500, date: "2026-03-15" },
    { name: "Luca Maestri", title: "SVP/CFO", type: "Sale", shares: 20000, value: 4469000, date: "2026-02-28" },
    { name: "Jeff Williams", title: "COO", type: "Sale", shares: 10000, value: 2234500, date: "2026-02-10" }
  ],
  institutions: [
    { holder: "Vanguard Group", shares: 1340000000, change: 1.2, date: "2026-03-31" },
    { holder: "BlackRock", shares: 1050000000, change: -0.5, date: "2026-03-31" },
    { holder: "Berkshire Hathaway", shares: 400000000, change: -2.1, date: "2026-03-31" },
    { holder: "State Street", shares: 620000000, change: 0.8, date: "2026-03-31" }
  ],
  congress: [
    { politician: "Nancy Pelosi", chamber: "House", type: "Purchase", amount: "$500K-$1M", date: "2026-03-01" },
    { politician: "Tommy Tuberville", chamber: "Senate", type: "Sale", amount: "$100K-$250K", date: "2026-02-15" }
  ],
  analyst: {
    consensus: "Outperform", priceTarget: 248.00, targetUpside: 10.98,
    buy: 32, hold: 8, sell: 2
  },
  esg: {
    total: 72, environmental: 68, social: 75, governance: 73, rating: "AA"
  },
  transcriptInsights: [
    "Services revenue grew 14% YoY — management guided for continued double-digit growth",
    "Apple Intelligence rollout expanding to 8 new languages — 'still early innings' per Cook",
    "Gross margin expansion driven by higher Services mix and M-series chip cost efficiencies",
    "China revenue declined 4% — management acknowledged macro headwinds but noted India growth",
    "Capital return: $25B in buybacks last quarter, $110B authorized for FY26"
  ],
  news: [
    { title: "Apple's AI Push: New On-Device Models Outperform Cloud Rivals", date: "2026-04-02", url: "#", sentiment: "positive" },
    { title: "EU Antitrust Probe Into App Store Fees Enters Final Phase", date: "2026-04-01", url: "#", sentiment: "negative" },
    { title: "Apple Vision Pro 2 Leaks Suggest 50% Price Cut", date: "2026-03-30", url: "#", sentiment: "positive" }
  ],
  revenueSegments: [
    { segment: "iPhone", revenue: 205000, pct: 52.1 },
    { segment: "Services", revenue: 96000, pct: 24.4 },
    { segment: "Mac", revenue: 40000, pct: 10.2 },
    { segment: "iPad", revenue: 29000, pct: 7.4 },
    { segment: "Wearables", revenue: 23000, pct: 5.9 }
  ],
  geoSegments: [
    { region: "Americas", revenue: 170000, pct: 43.3 },
    { region: "Europe", revenue: 102000, pct: 25.9 },
    { region: "Greater China", revenue: 67000, pct: 17.0 },
    { region: "Japan", revenue: 25000, pct: 6.4 },
    { region: "Rest of Asia", revenue: 29000, pct: 7.4 }
  ],
  financialHistory: [
    { year: "2020", revenue: 274515, netIncome: 57411, fcf: 73365, eps: 3.28, dividend: 0.80 },
    { year: "2021", revenue: 365817, netIncome: 94680, fcf: 92953, eps: 5.61, dividend: 0.85 },
    { year: "2022", revenue: 394328, netIncome: 99803, fcf: 111443, eps: 6.11, dividend: 0.91 },
    { year: "2023", revenue: 383285, netIncome: 96995, fcf: 110543, eps: 6.13, dividend: 0.96 },
    { year: "2024", revenue: 391035, netIncome: 101400, fcf: 108800, eps: 6.57, dividend: 1.00 },
    { year: "2025E", revenue: 410000, netIncome: 108500, fcf: 115000, eps: 7.15, dividend: 1.04 }
  ],
  statements: {
    income: [
      { year: "2021", revenue: 365817, cogs: 212981, grossProfit: 152836, rd: 21914, sga: 21973, operatingIncome: 108949, ebitda: 120233, netIncome: 94680, eps: 5.61, sharesBasic: 16865, interestExpense: 2645, taxRate: 13.3, grossMargin: 41.8, operatingMargin: 29.8, netMargin: 25.9 },
      { year: "2022", revenue: 394328, cogs: 223546, grossProfit: 170782, rd: 26251, sga: 25094, operatingIncome: 119437, ebitda: 130541, netIncome: 99803, eps: 6.11, sharesBasic: 16325, interestExpense: 2830, taxRate: 16.2, grossMargin: 43.3, operatingMargin: 30.3, netMargin: 25.3 },
      { year: "2023", revenue: 383285, cogs: 214137, grossProfit: 169148, rd: 29915, sga: 24932, operatingIncome: 114301, ebitda: 125820, netIncome: 96995, eps: 6.13, sharesBasic: 15813, interestExpense: 3933, taxRate: 14.7, grossMargin: 44.1, operatingMargin: 29.8, netMargin: 25.3 },
      { year: "2024", revenue: 391035, cogs: 210352, grossProfit: 180683, rd: 31370, sga: 26097, operatingIncome: 123216, ebitda: 134660, netIncome: 101400, eps: 6.57, sharesBasic: 15441, interestExpense: 3765, taxRate: 14.7, grossMargin: 46.2, operatingMargin: 31.5, netMargin: 26.4 },
      { year: "2025E", revenue: 410000, cogs: 217820, grossProfit: 192180, rd: 33000, sga: 27200, operatingIncome: 131980, ebitda: 144500, netIncome: 108500, eps: 7.15, sharesBasic: 15180, interestExpense: 3500, taxRate: 15.0, grossMargin: 46.9, operatingMargin: 32.2, netMargin: 26.5 },
    ],
    balance: [
      { year: "2021", cash: 62639, receivables: 26278, inventory: 6580, currentAssets: 134836, ppe: 39440, goodwill: 0, intangibles: 0, totalAssets: 351002, currentLiabilities: 125481, longTermDebt: 109106, totalLiabilities: 287912, totalEquity: 63090, retainedEarnings: 5562, bookValue: 3.74 },
      { year: "2022", cash: 48304, receivables: 28184, inventory: 4946, currentAssets: 135405, ppe: 42117, goodwill: 0, intangibles: 0, totalAssets: 352755, currentLiabilities: 153982, longTermDebt: 98959, totalLiabilities: 302083, totalEquity: 50672, retainedEarnings: -3068, bookValue: 3.10 },
      { year: "2023", cash: 61555, receivables: 29508, inventory: 6331, currentAssets: 143566, ppe: 43671, goodwill: 0, intangibles: 0, totalAssets: 352583, currentLiabilities: 145308, longTermDebt: 95281, totalLiabilities: 290437, totalEquity: 62146, retainedEarnings: -214, bookValue: 3.95 },
      { year: "2024", cash: 65171, receivables: 33410, inventory: 7286, currentAssets: 152987, ppe: 45680, goodwill: 0, intangibles: 0, totalAssets: 364980, currentLiabilities: 176392, longTermDebt: 91030, totalLiabilities: 308030, totalEquity: 56950, retainedEarnings: -19154, bookValue: 3.77 },
    ],
    cashflow: [
      { year: "2021", operatingCF: 104038, capex: -11085, freeCashFlow: 92953, acquisitions: -33, dividendsPaid: -14467, buybacks: -85971, debtIssuance: 20393, debtRepayment: -8750, netChange: 1507 },
      { year: "2022", operatingCF: 122151, capex: -10708, freeCashFlow: 111443, acquisitions: -306, dividendsPaid: -14841, buybacks: -89402, debtIssuance: 9420, debtRepayment: -9543, netChange: -10952 },
      { year: "2023", operatingCF: 113736, capex: -10959, freeCashFlow: 102777, acquisitions: -1337, dividendsPaid: -15025, buybacks: -77550, debtIssuance: 5228, debtRepayment: -11151, netChange: 1175 },
      { year: "2024", operatingCF: 118254, capex: -9447, freeCashFlow: 108807, acquisitions: -1524, dividendsPaid: -15234, buybacks: -94949, debtIssuance: 9958, debtRepayment: -5998, netChange: 5731 },
    ],
  },
  macroSensitivity: {
    factors: [
      {
        name: "USD Strength (DXY)",
        direction: "Headwind",
        impact: "High",
        currentTrend: "DXY at 104.2 — strong dollar compresses ~57% of revenue earned internationally when converted back to USD",
        transmissionChannel: "FX Translation → International Revenue"
      },
      {
        name: "Interest Rates (Fed Funds)",
        direction: "Headwind",
        impact: "Medium",
        currentTrend: "Fed funds at 4.75% — elevated rates increase WACC and compress growth stock multiples. Also pressures consumer financing for high-ASP devices",
        transmissionChannel: "Discount Rate → Valuation Multiple"
      },
      {
        name: "China Trade / Geopolitical",
        direction: "Headwind",
        impact: "High",
        currentTrend: "Ongoing US-China tech tensions. Tariff risk on assembled goods + Huawei competing with government backing. China = 17% of revenue",
        transmissionChannel: "Tariffs & Regulation → Supply Chain + Demand"
      },
      {
        name: "Consumer Confidence (US)",
        direction: "Neutral",
        impact: "Medium",
        currentTrend: "Conference Board index at 102.4 — stable but not expanding. iPhone is discretionary spend; upgrade cycles stretch in low-confidence environments",
        transmissionChannel: "Spending Sentiment → iPhone Unit Volumes"
      },
      {
        name: "Semiconductor Supply",
        direction: "Tailwind",
        impact: "Medium",
        currentTrend: "TSMC advanced node capacity expanding. Apple secured priority allocation for 3nm/2nm. No near-term constraint on M-series or A-series chip supply",
        transmissionChannel: "Chip Availability → Product Launch Timing"
      },
      {
        name: "India Growth / Diversification",
        direction: "Tailwind",
        impact: "Medium",
        currentTrend: "India manufacturing ramp (Foxconn Chennai, Tata Electronics) reducing China dependency. India smartphone market growing 12% YoY — Apple gaining share in premium segment",
        transmissionChannel: "Supply Chain Resilience + New Demand Market"
      }
    ],
    overallMacroRisk: "Moderate",
    macroSummary: "Apple faces headwinds from USD strength and China geopolitics, partially offset by semiconductor supply tailwinds and India diversification. Interest rate sensitivity is moderate — Apple's cash generation reduces reliance on external financing, but elevated rates compress the growth multiple investors pay.",
    rippleEffects: [
      {
        event: "Potential US-China tariff escalation",
        directEffect: "10-25% tariff on China-assembled iPhones could add $80-200 per unit to cost",
        secondaryImpact: "Accelerates India/Vietnam manufacturing shift, but transition takes 18-24 months. Short-term margin compression of 200-400bps"
      },
      {
        event: "Fed rate cut cycle begins (H2 2026)",
        directEffect: "Lower discount rates expand growth multiples — P/E could re-rate from 34x toward 38-40x",
        secondaryImpact: "Weaker USD boosts international revenue translation by 2-4%. Consumer financing costs drop, supporting iPhone upgrade cycles"
      },
      {
        event: "TSMC Arizona fab delays",
        directEffect: "No immediate Apple impact — production still concentrated in Taiwan",
        secondaryImpact: "Increases geopolitical risk premium on all companies dependent on Taiwan semiconductor manufacturing, including Apple's entire product line"
      }
    ]
  },
  bullCase: [
    "Services flywheel: 1B+ active devices with rising ARPU and 70%+ margins",
    "Apple Intelligence could trigger a multi-year iPhone upgrade supercycle",
    "India manufacturing buildout de-risks China concentration and opens a massive market",
    "Capital return machine: $110B buyback program systematically shrinking float"
  ],
  bearCase: [
    "iPhone maturity: hardware innovation cycles slowing, AI differentiation unclear",
    "Regulatory risk: EU DMA, US antitrust, App Store fee pressure eroding Services margins",
    "China risk: geopolitical tensions + local competitors (Huawei) gaining share",
    "Valuation stretched: 34x P/E vs 28x 5-year average, DCF shows -11% overvaluation"
  ],
  risks: [
    "Antitrust / regulatory actions forcing App Store fee cuts",
    "China revenue deterioration accelerating beyond macro headwinds",
    "AI strategy failing to differentiate vs Android/Google ecosystem",
    "Consumer spending slowdown compressing iPhone ASPs"
  ],
  catalysts: [
    "Apple Intelligence driving iPhone 18 supercycle (H2 2026)",
    "Services reaching $100B run-rate triggers re-rating as platform company",
    "Vision Pro 2 at accessible price point opening new product category",
    "India becoming top-3 revenue market within 2 years"
  ],
  verdict: {
    rating: "WATCHLIST",
    summary: "Exceptional business with a wide moat and best-in-class capital allocation, but current valuation (34x P/E, -11% DCF upside) offers insufficient margin of safety. Accumulate on a pullback to $195-205 range.",
    positionGuidance: "Wait for 10-15% pullback. Target entry near DCF intrinsic value (~$198). Position size: 3-5% of portfolio given concentration risk."
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = {
  currency: (n: number) => n >= 1e12 ? `$${(n/1e12).toFixed(2)}T` : n >= 1e9 ? `$${(n/1e9).toFixed(1)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : `$${n.toLocaleString()}`,
  pct: (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`,
  ratio: (n: number) => n.toFixed(1) + "x",
};

function MetricCard({ label, value, subValue, trend, icon: Icon, tooltip: tip }: {
  label: string; value: string; subValue?: string; trend?: "up" | "down" | "neutral";
  icon?: any; tooltip?: string;
}) {
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-400";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const inner = (
    <div className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col gap-1 hover:border-zinc-600 transition-colors cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
        {Icon && <Icon className="w-3.5 h-3.5 text-zinc-600" />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-lg font-semibold text-zinc-100 tracking-tight">{value}</span>
        {trend && <TrendIcon className={`w-3.5 h-3.5 ${trendColor} mb-0.5`} />}
      </div>
      {subValue && <span className={`text-[11px] ${trendColor}`}>{subValue}</span>}
    </div>
  );
  return tip ? <TooltipProvider><Tooltip><TooltipTrigger asChild>{inner}</TooltipTrigger><TooltipContent className="text-xs">{tip}</TooltipContent></Tooltip></TooltipProvider> : inner;
}

function RatingBadge({ rating }: { rating: string }) {
  const colors = {
    "STRONG ACCUMULATE": "bg-emerald-900 text-emerald-300",
    "ACCUMULATE": "bg-emerald-900/60 text-emerald-300",
    "HOLD": "bg-yellow-900 text-yellow-300",
    "WATCHLIST": "bg-orange-900/60 text-orange-300",
    "AVOID": "bg-red-900/60 text-red-300"
  };
  return <Badge className={`${colors[rating as keyof typeof colors] || "bg-zinc-800 text-zinc-300"} font-semibold text-xs tracking-wide`}>{rating}</Badge>;
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function GaugeBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs font-medium text-zinc-200">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Export Helpers ──────────────────────────────────────────────────────────
function exportJSON(data: AnalysisData) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.ticker}-analysis.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(data: AnalysisData) {
  const rows = [
    ["Metric", "Value", "Category"],
    ["Ticker", data.ticker, "Overview"],
    ["Company Name", data.overview.name, "Overview"],
    ["Sector", data.overview.sector, "Overview"],
    ["Industry", data.overview.industry, "Overview"],
    ["Market Cap", fmt.currency(data.overview.marketCap), "Fundamental"],
    ["Current Price", `$${data.price.current}`, "Price"],
    ["P/E Ratio", fmt.ratio(data.valuation.peRatio), "Valuation"],
    ["Forward P/E", fmt.ratio(data.valuation.forwardPE), "Valuation"],
    ["EV/EBITDA", fmt.ratio(data.valuation.evEbitda), "Valuation"],
    ["Price to Book", fmt.ratio(data.valuation.priceToBook), "Valuation"],
    ["PEG Ratio", fmt.ratio(data.valuation.pegRatio), "Valuation"],
    ["Price/Sales", fmt.ratio(data.valuation.priceSales), "Valuation"],
    ["ROIC 3y Avg", data.quality.roic3yAvg.toFixed(1) + "%", "Quality"],
    ["ROE", data.quality.roe.toFixed(1) + "%", "Quality"],
    ["ROA", data.quality.roa.toFixed(1) + "%", "Quality"],
    ["FCF Yield", data.quality.fcfYield.toFixed(1) + "%", "Quality"],
    ["Revenue CAGR 3y", data.quality.revenueCAGR3y.toFixed(1) + "%", "Growth"],
    ["EPS CAGR 3y", data.quality.epsCAGR3y.toFixed(1) + "%", "Growth"],
    ["FCF CAGR 3y", data.quality.fcfCAGR3y.toFixed(1) + "%", "Growth"],
    ["Moat Rating", data.moat.moatRating, "Moat"],
    ["Gross Margin (Latest)", data.moat.grossMargins[data.moat.grossMargins.length - 1].margin.toFixed(1) + "%", "Moat"],
    ["Operating Margin (Latest)", data.moat.operatingMargins[data.moat.operatingMargins.length - 1].margin.toFixed(1) + "%", "Moat"],
    ["Net Margin (Latest)", data.moat.netMargins[data.moat.netMargins.length - 1].margin.toFixed(1) + "%", "Moat"],
    ["Buyback Yield", data.capital.buybackYield.toFixed(2) + "%", "Capital Allocation"],
    ["Dividend Yield", data.capital.dividendYield.toFixed(2) + "%", "Capital Allocation"],
    ["Total Shareholder Yield", data.capital.totalShareholderYield.toFixed(2) + "%", "Capital Allocation"],
    ["Net Debt/EBITDA", fmt.ratio(data.solvency.netDebtEbitda), "Solvency"],
    ["Interest Coverage", fmt.ratio(data.solvency.interestCoverage), "Solvency"],
    ["Current Ratio", fmt.ratio(data.solvency.currentRatio), "Solvency"],
    ["Debt to Equity", fmt.ratio(data.solvency.debtToEquity), "Solvency"],
    ["DCF Intrinsic Value", `$${data.dcf.intrinsicValue}`, "DCF"],
    ["DCF Upside", fmt.pct(data.dcf.upside), "DCF"],
    ["Margin of Safety", data.dcf.marginOfSafety, "DCF"],
    ["WACC", data.dcf.wacc.toFixed(1) + "%", "DCF"],
    ["Analyst Consensus", data.analyst.consensus, "Analyst"],
    ["Price Target", `$${data.analyst.priceTarget}`, "Analyst"],
    ["Target Upside", fmt.pct(data.analyst.targetUpside), "Analyst"],
    ["Rating", data.verdict.rating, "Verdict"],
    ["Overall Macro Risk", data.macroSensitivity.overallMacroRisk, "Macro"],
    ...data.macroSensitivity.factors.map(f => [f.name, `${f.direction} (${f.impact})`, "Macro"]),
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.ticker}-analysis.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF() {
  window.print();
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [searchTicker, setSearchTicker] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hey! Ask me anything about the currently loaded analysis. Try: 'What's the revenue trend?', 'Show me the balance sheet', 'Is the stock overvalued?', or 'What are the main risks?'" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AnalysisData>(() => {
    if (typeof window !== "undefined" && (window as any).__ANALYSIS_DATA__) {
      return (window as any).__ANALYSIS_DATA__;
    }
    return DEMO_DATA;
  });
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [history, setHistory] = useState<string[]>(["AAPL"]);
  const [importJsonOpen, setImportJsonOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareTickerSearch, setCompareTickerSearch] = useState("");
  const [compareData, setCompareData] = useState<AnalysisData | null>(null);

  const d = data;

  // Handle ticker analysis
  const handleAnalyze = () => {
    if (searchTicker && !history.includes(searchTicker)) {
      setHistory([...history, searchTicker]);
    }
    setSearchTicker("");
    setSearchOpen(false);
    setSearchQuery("");
  };

  // ─── Smart Query Engine ──────────────────────────────────────────────────
  const handleChatQuery = () => {
    const q = chatInput.trim().toLowerCase();
    if (!q) return;
    const newMessages = [...chatMessages, { role: "user" as const, text: chatInput.trim() }];
    setChatInput("");

    const d = data;
    let reply = "";

    if (/revenue|sales|top.?line/.test(q)) {
      const rows = d.statements.income.map(r => `  ${r.year}: $${(r.revenue/1000).toFixed(1)}B (GM: ${r.grossMargin}%)`).join("\n");
      const cagr = d.quality.revenueCAGR3y;
      reply = `**${d.ticker} Revenue History**\n${rows}\n\n3-Year CAGR: ${cagr > 0 ? "+" : ""}${cagr.toFixed(1)}%\nLatest gross margin: ${d.statements.income[d.statements.income.length-1].grossMargin}%`;
    } else if (/income.?statement|profit.?loss|p&l|earnings/.test(q)) {
      const latest = d.statements.income[d.statements.income.length-1];
      reply = `**${d.ticker} Income Statement (${latest.year})**\nRevenue: $${(latest.revenue/1000).toFixed(1)}B\nGross Profit: $${(latest.grossProfit/1000).toFixed(1)}B (${latest.grossMargin}%)\nOperating Income: $${(latest.operatingIncome/1000).toFixed(1)}B (${latest.operatingMargin}%)\nNet Income: $${(latest.netIncome/1000).toFixed(1)}B (${latest.netMargin}%)\nEBITDA: $${(latest.ebitda/1000).toFixed(1)}B\nEPS: $${latest.eps}\nR&D: $${(latest.rd/1000).toFixed(1)}B\nSG&A: $${(latest.sga/1000).toFixed(1)}B`;
    } else if (/balance.?sheet|assets|liabilit|equity/.test(q)) {
      const latest = d.statements.balance[d.statements.balance.length-1];
      reply = `**${d.ticker} Balance Sheet (${latest.year})**\nCash: $${(latest.cash/1000).toFixed(1)}B\nTotal Assets: $${(latest.totalAssets/1000).toFixed(1)}B\nCurrent Liabilities: $${(latest.currentLiabilities/1000).toFixed(1)}B\nLong-term Debt: $${(latest.longTermDebt/1000).toFixed(1)}B\nTotal Equity: $${(latest.totalEquity/1000).toFixed(1)}B\nGoodwill: $${(latest.goodwill/1000).toFixed(1)}B`;
    } else if (/cash.?flow|fcf|free.?cash|capex/.test(q)) {
      const latest = d.statements.cashflow[d.statements.cashflow.length-1];
      reply = `**${d.ticker} Cash Flow (${latest.year})**\nOperating CF: $${(latest.operatingCF/1000).toFixed(1)}B\nCapEx: $${(latest.capex/1000).toFixed(1)}B\nFree Cash Flow: $${(latest.freeCashFlow/1000).toFixed(1)}B\nBuybacks: $${(Math.abs(latest.buybacks)/1000).toFixed(1)}B\nDividends Paid: $${(Math.abs(latest.dividendsPaid)/1000).toFixed(1)}B\nFCF Yield: ${d.quality.fcfYield.toFixed(1)}%`;
    } else if (/margin|profitab/.test(q)) {
      const rows = d.statements.income.map(r => `  ${r.year}: Gross ${r.grossMargin}% | Op ${r.operatingMargin}% | Net ${r.netMargin}%`).join("\n");
      reply = `**${d.ticker} Margin Trends**\n${rows}`;
    } else if (/debt|leverage|solven|interest/.test(q)) {
      reply = `**${d.ticker} Solvency**\nNet Debt/EBITDA: ${d.solvency.netDebtEbitda.toFixed(1)}x (safe < 2x)\nInterest Coverage: ${d.solvency.interestCoverage.toFixed(1)}x (safe > 5x)\nD/E Ratio: ${d.solvency.debtToEquity.toFixed(1)}x\nCash: ${fmt.currency(d.solvency.cashAndEquivalents)}\nTotal Debt: ${fmt.currency(d.solvency.totalDebt)}\n24-mo Survival: ${d.solvency.canSurvive24mo ? "✓ YES" : "✗ NO"}`;
    } else if (/valuat|cheap|expens|overvalued|undervalued|pe|p\/e|multiple/.test(q)) {
      reply = `**${d.ticker} Valuation**\nP/E (TTM): ${d.valuation.peRatio}x (5y avg: ${d.valuation.historicalPE5y}x)\nForward P/E: ${d.valuation.forwardPE}x\nEV/EBITDA: ${d.valuation.evEbitda}x (5y avg: ${d.valuation.historicalEvEbitda5y}x)\nP/B: ${d.valuation.priceToBook}x | P/S: ${d.valuation.priceSales}x\nPEG: ${d.valuation.pegRatio}x\n\nDCF Intrinsic Value: $${d.dcf.intrinsicValue}\nCurrent Price: $${d.price.current}\nDCF Upside: ${fmt.pct(d.dcf.upside)}\nVerdict: **${d.dcf.marginOfSafety}**`;
    } else if (/dcf|intrinsic|discount/.test(q)) {
      reply = `**${d.ticker} DCF Valuation**\nIntrinsic Value: $${d.dcf.intrinsicValue}\nCurrent Price: $${d.price.current}\nUpside: ${fmt.pct(d.dcf.upside)}\nWACC: ${d.dcf.wacc}%\nTerminal Growth Rate: ${d.dcf.terminalGrowth}%\nMargin of Safety: **${d.dcf.marginOfSafety}**`;
    } else if (/roic|return.?invest|quality/.test(q)) {
      reply = `**${d.ticker} Return Metrics**\nROIC (TTM): ${d.quality.roic.toFixed(1)}% (3y avg: ${d.quality.roic3yAvg.toFixed(1)}%)\nROE: ${d.quality.roe.toFixed(1)}%\nROA: ${d.quality.roa.toFixed(1)}%\nFCF Yield: ${d.quality.fcfYield.toFixed(1)}%\nEarnings Yield: ${d.quality.earningsYield.toFixed(1)}%\n\nROIC > 12% threshold: ${d.quality.roic3yAvg > 12 ? "✓ YES — value creation" : "✗ NO — value destruction risk"}`;
    } else if (/moat|compet|advantage|switch|network|pric.?power/.test(q)) {
      reply = `**${d.ticker} Economic Moat: ${d.moat.moatRating}**\n\nSwitching Costs: ${d.moat.switchingCosts}\nNetwork Effects: ${d.moat.networkEffects}\nPricing Power: ${d.moat.pricingPower}\nIntangibles: ${d.moat.intangibles}\nCost Advantage: ${d.moat.costAdvantage}`;
    } else if (/insider|ceo|cfo|execut/.test(q)) {
      const rows = d.insiders.map(i => `  ${i.name} (${i.title}): ${i.type} ${fmt.currency(i.value)} — ${i.date}`).join("\n");
      reply = `**${d.ticker} Recent Insider Trades**\n${rows}`;
    } else if (/institutional|13f|holder/.test(q)) {
      const rows = d.institutions.map(i => `  ${i.holder}: ${(i.shares/1e6).toFixed(0)}M shares (${i.change >= 0 ? "+" : ""}${i.change}%)`).join("\n");
      reply = `**${d.ticker} Top Institutional Holders**\n${rows}`;
    } else if (/congress|senate|house|politic/.test(q)) {
      const rows = d.congress.map(c => `  ${c.politician} (${c.chamber}): ${c.type} ${c.amount} — ${c.date}`).join("\n");
      reply = `**${d.ticker} Congressional Trades**\n${rows}`;
    } else if (/analyst|price.?target|consensus|rating/.test(q)) {
      reply = `**${d.ticker} Analyst Consensus**\nConsensus: ${d.analyst.consensus}\nPrice Target: $${d.analyst.priceTarget} (${fmt.pct(d.analyst.targetUpside)} upside)\nBuy: ${d.analyst.buy} | Hold: ${d.analyst.hold} | Sell: ${d.analyst.sell}`;
    } else if (/esg|environment|social|govern|sustain/.test(q)) {
      reply = `**${d.ticker} ESG Score: ${d.esg.total}/100 (${d.esg.rating})**\nEnvironmental: ${d.esg.environmental}/100\nSocial: ${d.esg.social}/100\nGovernance: ${d.esg.governance}/100`;
    } else if (/macro|geopolit|rate|inflation|currency|fx|usd/.test(q)) {
      const factors = d.macroSensitivity.factors.map(f => `  ${f.direction === "Tailwind" ? "↑" : f.direction === "Headwind" ? "↓" : "→"} ${f.name} [${f.impact}]: ${f.transmissionChannel}`).join("\n");
      reply = `**${d.ticker} Macro Sensitivity (${d.macroSensitivity.overallMacroRisk} Risk)**\n${factors}\n\n${d.macroSensitivity.macroSummary}`;
    } else if (/bull|upside|catalyst|positive/.test(q)) {
      const bull = d.bullCase.map((b, i) => `${i+1}. ${b}`).join("\n");
      const cat = d.catalysts.map((c, i) => `${i+1}. ${c}`).join("\n");
      reply = `**${d.ticker} Bull Case**\n${bull}\n\n**Catalysts**\n${cat}`;
    } else if (/bear|risk|downside|negative|danger/.test(q)) {
      const bear = d.bearCase.map((b, i) => `${i+1}. ${b}`).join("\n");
      const risks = d.risks.map((r, i) => `${i+1}. ${r}`).join("\n");
      reply = `**${d.ticker} Bear Case**\n${bear}\n\n**Key Risks**\n${risks}`;
    } else if (/verdict|rating|recommend|buy|sell|hold/.test(q)) {
      reply = `**${d.ticker} Investment Verdict**\nRating: **${d.verdict.rating}**\n\n${d.verdict.summary}\n\nPosition Guidance: ${d.verdict.positionGuidance}`;
    } else if (/dividend|payout|buyback|shareholder.?yield/.test(q)) {
      reply = `**${d.ticker} Capital Returns**\nDividend Yield: ${d.capital.dividendYield.toFixed(2)}%\nBuyback Yield: ${d.capital.buybackYield.toFixed(1)}%\nTotal Shareholder Yield: ${d.capital.totalShareholderYield.toFixed(1)}%\nPayout Ratio: ${d.capital.payoutRatio.toFixed(0)}%\nRetention Ratio: ${d.capital.retentionRatio.toFixed(0)}%`;
    } else if (/peer|competitor|compare/.test(q)) {
      const rows = d.peers.map(p => `  ${p.name} (${p.ticker}): P/E ${p.pe.toFixed(1)}x | ROIC ${p.roic.toFixed(1)}% | Rev Growth ${p.revenueGrowth > 0 ? "+" : ""}${p.revenueGrowth.toFixed(1)}%`).join("\n");
      reply = `**${d.ticker} vs Peers**\n${d.overview.name}: P/E ${d.valuation.peRatio.toFixed(1)}x | ROIC ${d.quality.roic.toFixed(1)}% | Rev Growth ${d.quality.revenueCAGR3y > 0 ? "+" : ""}${d.quality.revenueCAGR3y.toFixed(1)}%\n${rows}`;
    } else if (/news|headline|recent/.test(q)) {
      const rows = d.news.map(n => `  [${n.sentiment.toUpperCase()}] ${n.title} (${n.date})`).join("\n");
      reply = `**${d.ticker} Recent Headlines**\n${rows}`;
    } else if (/eps|earnings.?per.?share/.test(q)) {
      const rows = d.statements.income.map(r => `  ${r.year}: $${r.eps} EPS`).join("\n");
      reply = `**${d.ticker} EPS History**\n${rows}\n\n3-Year EPS CAGR: ${d.quality.epsCAGR3y > 0 ? "+" : ""}${d.quality.epsCAGR3y.toFixed(1)}%`;
    } else if (/price|stock|52.?week|ath|all.?time/.test(q)) {
      reply = `**${d.ticker} Price Context**\nCurrent: $${d.price.current} (${fmt.pct(d.price.changePct)} today)\n52-Week: $${d.price.fiftyTwoLow} – $${d.price.fiftyTwoHigh}\nAll-Time High: $${d.price.allTimeHigh} (${d.price.athDate})\nFrom ATH: ${fmt.pct(((d.price.current - d.price.allTimeHigh) / d.price.allTimeHigh) * 100)}\nYTD: ${fmt.pct(d.price.ytd)} | 1Y: ${fmt.pct(d.price.oneYear)} | 5Y: ${fmt.pct(d.price.fiveYear)}\nBeta: ${d.price.beta.toFixed(2)}`;
    } else if (/summary|overview|tell me|what is|who is/.test(q)) {
      reply = `**${d.ticker} — ${d.overview.name}**\n${d.overview.description}\n\nSector: ${d.overview.sector} | Industry: ${d.overview.industry}\nCEO: ${d.overview.ceo} | Employees: ${d.overview.employees.toLocaleString()}\nMarket Cap: ${fmt.currency(d.overview.marketCap)}\nRating: **${d.verdict.rating}** — ${d.verdict.summary}`;
    } else {
      // External / unknown query — generate a Claude prompt
      reply = `I don't have data on "${chatInput.trim()}" in the current ${d.ticker} analysis.\n\n**Copy this prompt and ask Claude:**\n\n> Using the Deep Value Analyst v2 framework, ${chatInput.trim()} for ${d.ticker}.`;
    }

    setTimeout(() => {
      setChatMessages([...newMessages, { role: "assistant", text: reply }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 200);
  };

  // Handle JSON import
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson) as AnalysisData;
      if (!parsed.ticker || !parsed.valuation) {
        alert("Invalid analysis data format");
        return;
      }
      setData(parsed);
      if (!history.includes(parsed.ticker)) {
        setHistory([...history, parsed.ticker]);
      }
      setImportJson("");
      setImportJsonOpen(false);
    } catch (e) {
      alert("Failed to parse JSON: " + (e as Error).message);
    }
  };

  // Add current to portfolio
  const addToPortfolio = () => {
    const existing = portfolio.find(p => p.ticker === data.ticker);
    if (existing) {
      alert("Already in portfolio");
      return;
    }
    setPortfolio([...portfolio, { ticker: data.ticker, data, addedDate: new Date().toISOString().split("T")[0], notes: "" }]);
  };

  // Remove from portfolio
  const removeFromPortfolio = (ticker: string) => {
    setPortfolio(portfolio.filter(p => p.ticker !== ticker));
  };

  // Update portfolio notes
  const updatePortfolioNotes = (ticker: string, notes: string) => {
    setPortfolio(portfolio.map(p => p.ticker === ticker ? { ...p, notes } : p));
  };

  // Handle compare mode
  const handleCompare = (ticker: string) => {
    const item = portfolio.find(p => p.ticker === ticker);
    if (item) {
      setCompareData(item.data);
      setCompareMode(true);
    }
  };

  const d2 = compareData;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          * { color: #000 !important; background: #fff !important; border-color: #ddd !important; }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800 no-print">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-zinc-800 border border-zinc-700"><BarChart3 className="w-4 h-4 text-cyan-400" /></div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-zinc-100">DEEP VALUE ANALYST</h1>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Fundamental Investment Research</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  <Input
                    value={searchQuery || searchTicker}
                    onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={e => { if (e.key === "Enter") { setSearchOpen(false); handleAnalyze(); } if (e.key === "Escape") setSearchOpen(false); }}
                    placeholder="Ticker or company..."
                    className="pl-9 w-52 h-8 bg-zinc-900 border-zinc-700 text-sm placeholder:text-zinc-600 focus:border-cyan-600"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-zinc-900 border-zinc-700" align="start">
                <Command className="bg-zinc-900">
                  <CommandInput
                    placeholder="Search ticker or company..."
                    value={searchQuery}
                    onValueChange={v => setSearchQuery(v)}
                    className="h-9 text-sm text-zinc-200 bg-zinc-900 border-b border-zinc-700"
                  />
                  <CommandList>
                    <CommandEmpty className="py-3 text-center text-xs text-zinc-500">No results found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-64">
                        {STOCK_LIST.filter(s =>
                          s.t.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.n.toLowerCase().includes(searchQuery.toLowerCase())
                        ).slice(0, 30).map(s => (
                          <CommandItem
                            key={s.t}
                            value={`${s.t} ${s.n}`}
                            onSelect={() => {
                              setSearchTicker(s.t);
                              setSearchQuery("");
                              setSearchOpen(false);
                            }}
                            className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer text-zinc-200 hover:bg-zinc-800 aria-selected:bg-zinc-800"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-cyan-400 text-xs w-16 shrink-0">{s.t}</span>
                              <span className="text-xs text-zinc-300 truncate">{s.n}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 shrink-0">{s.x}</span>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button size="sm" onClick={handleAnalyze} className="h-8 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium tracking-wide" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "ANALYZE"}
            </Button>
            <Dialog open={importJsonOpen} onOpenChange={setImportJsonOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-zinc-400 text-xs"><Upload className="w-3.5 h-3.5 mr-1" />Import</Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">Import Analysis JSON</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">Ask Claude to analyze a ticker, then paste the JSON result below:</p>
                  <Textarea value={importJson} onChange={e => setImportJson(e.target.value)} placeholder='Paste JSON here...' className="min-h-32 bg-zinc-800 border-zinc-700 text-sm font-mono text-zinc-200 focus:border-cyan-600" />
                  <Button onClick={handleImportJson} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium">Import</Button>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-zinc-700 text-zinc-400 text-xs"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800 w-48">
                <DropdownMenuItem onClick={() => exportJSON(data)} className="text-xs text-zinc-300 cursor-pointer">Export as JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportCSV(data)} className="text-xs text-zinc-300 cursor-pointer">Export as CSV/Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF} className="text-xs text-zinc-300 cursor-pointer">Export as PDF (Print)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
        {/* Analyze message */}
        {searchTicker && !data && (
          <Card className="bg-orange-900/20 border-orange-800">
            <CardContent className="pt-6">
              <p className="text-sm text-orange-200">Ask Claude to analyze <strong>{searchTicker}</strong> — then paste the JSON result below using the Import button.</p>
            </CardContent>
          </Card>
        )}

        {/* Ticker Header + Verdict */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold tracking-tight">{d.ticker}</h2>
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-[10px]">{d.overview.exchange}</Badge>
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-[10px]">{d.overview.sector}</Badge>
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-[10px]">Analyzed {d.lastUpdated}</Badge>
            </div>
            <p className="text-sm text-zinc-500 mt-1">{d.overview.name} — {d.overview.industry}</p>
            <p className="text-xs text-zinc-600 mt-1">{d.overview.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${d.price.current.toFixed(2)}</span>
              <span className={`text-sm font-medium flex items-center gap-1 ${d.price.changePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {d.price.changePct >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {fmt.pct(d.price.changePct)}
              </span>
            </div>
            <RatingBadge rating={d.verdict.rating} />
            <Button size="sm" onClick={addToPortfolio} className="h-7 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs gap-1"><Plus className="w-3 h-3" />Add to Portfolio</Button>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-zinc-200 leading-relaxed">{d.verdict.summary}</p>
              <p className="text-xs text-zinc-500 mt-2"><span className="text-zinc-400 font-medium">Position guidance:</span> {d.verdict.positionGuidance}</p>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-px bg-zinc-800">
          <MetricCard label="P/E (TTM)" value={fmt.ratio(d.valuation.peRatio)} subValue={`5y avg: ${fmt.ratio(d.valuation.historicalPE5y)}`} trend={d.valuation.peRatio > d.valuation.historicalPE5y ? "down" : "up"} icon={DollarSign} tooltip="Price to Earnings. Lower = cheaper relative to earnings." />
          <MetricCard label="EV/EBITDA" value={fmt.ratio(d.valuation.evEbitda)} subValue={`5y avg: ${fmt.ratio(d.valuation.historicalEvEbitda5y)}`} trend={d.valuation.evEbitda > d.valuation.historicalEvEbitda5y ? "down" : "up"} icon={Building2} tooltip="Enterprise Value to EBITDA. Debt-adjusted valuation." />
          <MetricCard label="ROIC 3y" value={d.quality.roic3yAvg.toFixed(1) + "%"} trend={d.quality.roic3yAvg > 12 ? "up" : "down"} icon={Zap} tooltip="Return on Invested Capital. >12% = value creation." />
          <MetricCard label="FCF Yield" value={d.quality.fcfYield.toFixed(1) + "%"} trend={d.quality.fcfYield > 3 ? "up" : "neutral"} icon={DollarSign} tooltip="Free Cash Flow / Market Cap." />
          <MetricCard label="Beta" value={d.price.beta.toFixed(2)} trend={d.price.beta < 1 ? "up" : d.price.beta > 1.5 ? "down" : "neutral"} icon={Activity} tooltip="Volatility vs S&P 500. <1 = less volatile. >1 = more volatile. Affects risk-adjusted return expectations." />
          <MetricCard label="Net Debt/EBITDA" value={fmt.ratio(d.solvency.netDebtEbitda)} trend={d.solvency.netDebtEbitda < 2 ? "up" : "down"} icon={Shield} tooltip="Leverage ratio. <2x generally safe." />
          <MetricCard label="Shareholder Yield" value={d.capital.totalShareholderYield.toFixed(1) + "%"} trend="up" icon={Users} tooltip="Buyback + Dividend yield." />
          <MetricCard label="DCF Upside" value={fmt.pct(d.dcf.upside)} trend={d.dcf.upside > 0 ? "up" : "down"} icon={Target} tooltip="Upside to intrinsic value." />
          <MetricCard label="Analyst Target" value={`$${d.analyst.priceTarget}`} subValue={fmt.pct(d.analyst.targetUpside)} trend={d.analyst.targetUpside > 0 ? "up" : "down"} icon={BookOpen} tooltip="Consensus analyst price target." />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fundamentals" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-auto flex-wrap gap-0.5 no-print">
            {[
              { v: "fundamentals", l: "Fundamentals", i: BarChart3 },
              { v: "moat", l: "Moat & Quality", i: Shield },
              { v: "valuation", l: "Valuation & DCF", i: Target },
              { v: "capital", l: "Capital Allocation", i: DollarSign },
              { v: "ownership", l: "Ownership & Insiders", i: Users },
              { v: "segments", l: "Revenue Mix", i: PieIcon },
              { v: "sentiment", l: "Sentiment & News", i: Newspaper },
              { v: "thesis", l: "Bull / Bear", i: Scale },
              { v: "macro", l: "Macro Sensitivity", i: Waves },
              { v: "statements", l: "Statements", i: FileText },
              { v: "portfolio", l: "Portfolio", i: Briefcase },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400 text-xs px-3 py-1.5 gap-1.5 text-zinc-400">
                <t.i className="w-3 h-3" />{t.l}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* FUNDAMENTALS */}
          <TabsContent value="fundamentals" className="space-y-6">
            <SectionTitle icon={BarChart3} title="Financial Performance" subtitle="Revenue, earnings, and cash flow history" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Revenue & Net Income Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={d.financialHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#71717a" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                      <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#06b6d4" name="Revenue ($M)" />
                      <Line type="monotone" dataKey="netIncome" stroke="#10b981" name="Net Income ($M)" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">EPS & Dividend Per Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={d.financialHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#71717a" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                      <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                      <Legend />
                      <Bar dataKey="eps" fill="#f59e0b" name="EPS" />
                      <Line type="monotone" dataKey="dividend" stroke="#ec4899" name="Dividend" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <SectionTitle icon={Activity} title="Key Quality Metrics" subtitle="Growth rates and return metrics" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <GaugeBar value={d.quality.revenueCAGR3y} max={20} label="Rev CAGR 3y" color="bg-cyan-500" />
                    <GaugeBar value={d.quality.epsCAGR3y} max={25} label="EPS CAGR 3y" color="bg-emerald-500" />
                    <GaugeBar value={d.quality.fcfCAGR3y} max={20} label="FCF CAGR 3y" color="bg-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <GaugeBar value={d.quality.roe} max={100} label="ROE" color="bg-yellow-500" />
                    <GaugeBar value={d.quality.roa} max={50} label="ROA" color="bg-orange-500" />
                    <GaugeBar value={d.quality.roic3yAvg} max={80} label="ROIC 3y" color="bg-pink-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-medium mb-1">FCF Yield</p>
                    <p className="text-xl font-bold text-cyan-400">{d.quality.fcfYield.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Earnings Yield</p>
                    <p className="text-xl font-bold text-emerald-400">{d.quality.earningsYield.toFixed(2)}%</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Market Cap</p>
                    <p className="text-lg font-bold text-yellow-400">{fmt.currency(d.overview.marketCap)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-medium mb-1">Employees</p>
                    <p className="text-lg font-bold text-purple-400">{d.overview.employees.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MOAT */}
          <TabsContent value="moat" className="space-y-6">
            <SectionTitle icon={Shield} title="Economic Moat & Competitive Advantage" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Margin Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={d.moat.grossMargins.map((m, i) => ({
                      year: m.year,
                      gross: m.margin,
                      operating: d.moat.operatingMargins[i].margin,
                      net: d.moat.netMargins[i].margin
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#71717a" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                      <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                      <Legend />
                      <Line type="monotone" dataKey="gross" stroke="#3b82f6" name="Gross" strokeWidth={2} />
                      <Line type="monotone" dataKey="operating" stroke="#f59e0b" name="Operating" strokeWidth={2} />
                      <Line type="monotone" dataKey="net" stroke="#10b981" name="Net" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Moat Sources</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-3">
                  <div>
                    <p className="font-semibold text-cyan-400 mb-1">Rating: {d.moat.moatRating}</p>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-300">Switching Costs</p>
                    <p className="text-zinc-400">{d.moat.switchingCosts}</p>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-300">Pricing Power</p>
                    <p className="text-zinc-400">{d.moat.pricingPower}</p>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-300">Intangibles</p>
                    <p className="text-zinc-400">{d.moat.intangibles}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* VALUATION */}
          <TabsContent value="valuation" className="space-y-6">
            <SectionTitle icon={Target} title="Valuation & DCF Analysis" subtitle="Relative and intrinsic value metrics" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Valuation Multiples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">P/E Ratio</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.peRatio)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Forward P/E</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.forwardPE)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">EV/EBITDA</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.evEbitda)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Price/Book</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.priceToBook)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Price/Sales</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.priceSales)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">PEG Ratio</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.pegRatio)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">EV/Revenue</span>
                    <span className="font-semibold text-zinc-100">{fmt.ratio(d.valuation.evRevenue)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">DCF Valuation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-medium">Intrinsic Value</p>
                    <p className="text-2xl font-bold text-cyan-400">${d.dcf.intrinsicValue.toFixed(2)}</p>
                    <p className="text-xs text-zinc-500 mt-1">vs Current: ${d.price.current.toFixed(2)}</p>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-medium">Upside/Downside</p>
                    <p className={`text-xl font-bold ${d.dcf.upside > 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt.pct(d.dcf.upside)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-medium">Margin of Safety</p>
                    <Badge variant="outline" className={`text-xs mt-1 ${d.dcf.marginOfSafety === "Undervalued" ? "bg-emerald-900/20 border-emerald-800 text-emerald-300" : d.dcf.marginOfSafety === "Overvalued" ? "bg-red-900/20 border-red-800 text-red-300" : "bg-yellow-900/20 border-yellow-800 text-yellow-300"}`}>{d.dcf.marginOfSafety}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">DCF Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <p className="text-zinc-500 uppercase font-medium">WACC</p>
                    <p className="text-lg font-semibold text-cyan-400 mt-1">{d.dcf.wacc.toFixed(1)}%</p>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div>
                    <p className="text-zinc-500 uppercase font-medium">Terminal Growth</p>
                    <p className="text-lg font-semibold text-emerald-400 mt-1">{d.dcf.terminalGrowth.toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">Peer Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="text-[10px] text-zinc-400">Company</TableHead>
                      <TableHead className="text-[10px] text-zinc-400 text-right">P/E</TableHead>
                      <TableHead className="text-[10px] text-zinc-400 text-right">EV/EBITDA</TableHead>
                      <TableHead className="text-[10px] text-zinc-400 text-right">ROIC</TableHead>
                      <TableHead className="text-[10px] text-zinc-400 text-right">Rev Growth</TableHead>
                      <TableHead className="text-[10px] text-zinc-400 text-right">Market Cap</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.peers.map(p => (
                      <TableRow key={p.ticker} className="border-zinc-800">
                        <TableCell className="text-xs text-zinc-200">{p.name}</TableCell>
                        <TableCell className="text-xs text-zinc-400 text-right">{fmt.ratio(p.pe)}</TableCell>
                        <TableCell className="text-xs text-zinc-400 text-right">{fmt.ratio(p.evEbitda)}</TableCell>
                        <TableCell className="text-xs text-zinc-400 text-right">{p.roic.toFixed(1)}%</TableCell>
                        <TableCell className="text-xs text-zinc-400 text-right">{p.revenueGrowth.toFixed(1)}%</TableCell>
                        <TableCell className="text-xs text-zinc-400 text-right">{fmt.currency(p.marketCap)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CAPITAL ALLOCATION */}
          <TabsContent value="capital" className="space-y-6">
            <SectionTitle icon={DollarSign} title="Capital Allocation & Shareholder Returns" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Shareholder Yield Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Dividend Yield</span>
                      <span className="text-lg font-bold text-cyan-400">{d.capital.dividendYield.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Buyback Yield</span>
                      <span className="text-lg font-bold text-emerald-400">{d.capital.buybackYield.toFixed(2)}%</span>
                    </div>
                    <Separator className="bg-zinc-800 my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-zinc-100">Total Shareholder Yield</span>
                      <span className="text-xl font-bold text-yellow-400">{d.capital.totalShareholderYield.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Payout Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <GaugeBar value={d.capital.payoutRatio} max={100} label="Payout Ratio" color="bg-cyan-500" />
                  <GaugeBar value={d.capital.retentionRatio} max={100} label="Retention Ratio" color="bg-emerald-500" />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">Share Count Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={d.capital.sharesOutstanding}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#71717a" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                    <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                    <Bar dataKey="shares" fill="#f59e0b" name="Shares (M)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OWNERSHIP */}
          <TabsContent value="ownership" className="space-y-6">
            <SectionTitle icon={Users} title="Ownership & Insider Activity" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Recent Insider Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-[10px] text-zinc-400">Name</TableHead>
                        <TableHead className="text-[10px] text-zinc-400">Type</TableHead>
                        <TableHead className="text-[10px] text-zinc-400 text-right">Shares</TableHead>
                        <TableHead className="text-[10px] text-zinc-400 text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {d.insiders.map((ins, i) => (
                        <TableRow key={i} className="border-zinc-800">
                          <TableCell className="text-xs text-zinc-200">{ins.name}</TableCell>
                          <TableCell className="text-xs"><Badge variant="outline" className={`text-[10px] ${ins.type === "Sale" ? "bg-red-900/20 border-red-800 text-red-300" : "bg-emerald-900/20 border-emerald-800 text-emerald-300"}`}>{ins.type}</Badge></TableCell>
                          <TableCell className="text-xs text-zinc-400 text-right">{ins.shares.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-zinc-400 text-right">{fmt.currency(ins.value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Top Institutional Holders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-[10px] text-zinc-400">Holder</TableHead>
                        <TableHead className="text-[10px] text-zinc-400 text-right">Shares (M)</TableHead>
                        <TableHead className="text-[10px] text-zinc-400 text-right">Change %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {d.institutions.map((inst, i) => (
                        <TableRow key={i} className="border-zinc-800">
                          <TableCell className="text-xs text-zinc-200">{inst.holder}</TableCell>
                          <TableCell className="text-xs text-zinc-400 text-right">{(inst.shares / 1e6).toFixed(0)}</TableCell>
                          <TableCell className={`text-xs text-right ${inst.change > 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt.pct(inst.change)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {d.congress.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Congressional Trading Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-[10px] text-zinc-400">Politician</TableHead>
                        <TableHead className="text-[10px] text-zinc-400">Chamber</TableHead>
                        <TableHead className="text-[10px] text-zinc-400">Type</TableHead>
                        <TableHead className="text-[10px] text-zinc-400">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {d.congress.map((cong, i) => (
                        <TableRow key={i} className="border-zinc-800">
                          <TableCell className="text-xs text-zinc-200">{cong.politician}</TableCell>
                          <TableCell className="text-xs text-zinc-400">{cong.chamber}</TableCell>
                          <TableCell className="text-xs"><Badge variant="outline" className={`text-[10px] ${cong.type === "Sale" ? "bg-red-900/20 border-red-800 text-red-300" : "bg-emerald-900/20 border-emerald-800 text-emerald-300"}`}>{cong.type}</Badge></TableCell>
                          <TableCell className="text-xs text-zinc-400">{cong.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEGMENTS */}
          <TabsContent value="segments" className="space-y-6">
            <SectionTitle icon={PieIcon} title="Revenue Segmentation" subtitle="Business mix by product line and geography" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Revenue by Product Segment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={d.revenueSegments} dataKey="revenue" nameKey="segment" cx="50%" cy="50%" outerRadius={100} label>
                        {d.revenueSegments.map((_, i) => <Cell key={i} fill={["#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][i % 5]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {d.revenueSegments.map((seg, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">{seg.segment}</span>
                        <span className="text-zinc-200 font-semibold">{seg.pct.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Revenue by Geography</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={d.geoSegments} dataKey="revenue" nameKey="region" cx="50%" cy="50%" outerRadius={100} label>
                        {d.geoSegments.map((_, i) => <Cell key={i} fill={["#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"][i % 5]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {d.geoSegments.map((geo, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">{geo.region}</span>
                        <span className="text-zinc-200 font-semibold">{geo.pct.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SENTIMENT */}
          <TabsContent value="sentiment" className="space-y-6">
            <SectionTitle icon={Newspaper} title="Sentiment & News" />
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-200">Recent News</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.news.map((n, i) => (
                  <div key={i} className="border-b border-zinc-800 pb-3 last:border-0">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${n.sentiment === "positive" ? "bg-emerald-900/20 border-emerald-800 text-emerald-300" : "bg-red-900/20 border-red-800 text-red-300"}`}>{n.sentiment}</Badge>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm text-zinc-200 font-medium leading-snug">{n.title}</p>
                        <p className="text-[10px] text-zinc-500">{n.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {d.esg && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">ESG Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">{d.esg.total}</p>
                      <p className="text-xs text-zinc-500 mt-1">Overall</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{d.esg.environmental}</p>
                      <p className="text-xs text-zinc-500 mt-1">Environmental</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{d.esg.social}</p>
                      <p className="text-xs text-zinc-500 mt-1">Social</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{d.esg.governance}</p>
                      <p className="text-xs text-zinc-500 mt-1">Governance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* THESIS */}
          <TabsContent value="thesis" className="space-y-6">
            <SectionTitle icon={Scale} title="Investment Thesis" subtitle="Bull and bear cases" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-emerald-900/20 border-emerald-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-emerald-300">Bull Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {d.bullCase.map((point, i) => (
                      <li key={i} className="text-sm text-zinc-200 flex gap-2">
                        <span className="text-emerald-400 shrink-0 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-red-900/20 border-red-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-300">Bear Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {d.bearCase.map((point, i) => (
                      <li key={i} className="text-sm text-zinc-200 flex gap-2">
                        <span className="text-red-400 shrink-0 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {d.transcriptInsights.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Earnings Call Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {d.transcriptInsights.map((insight, i) => (
                    <div key={i} className="text-sm text-zinc-300 flex gap-2">
                      <span className="text-cyan-400 shrink-0 mt-1">→</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Key Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {d.risks.map((risk, i) => (
                      <li key={i} className="text-sm text-zinc-200 flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-200">Near-term Catalysts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {d.catalysts.map((catalyst, i) => (
                      <li key={i} className="text-sm text-zinc-200 flex gap-2">
                        <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MACRO SENSITIVITY */}
          <TabsContent value="macro" className="space-y-6">
            <SectionTitle icon={Waves} title="Macro Sensitivity Analysis" subtitle={`How macroeconomic forces specifically affect ${d.ticker}`} />

            {/* Overall Risk + Summary */}
            <div className="bg-zinc-900 border border-zinc-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Overall Macro Risk</span>
                <Badge className={`text-xs font-semibold ${
                  d.macroSensitivity.overallMacroRisk === "Low" ? "bg-emerald-900 text-emerald-300" :
                  d.macroSensitivity.overallMacroRisk === "Moderate" ? "bg-amber-900 text-amber-300" :
                  d.macroSensitivity.overallMacroRisk === "Elevated" ? "bg-orange-900 text-orange-300" :
                  "bg-red-900 text-red-300"
                }`}>
                  {d.macroSensitivity.overallMacroRisk}
                </Badge>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{d.macroSensitivity.macroSummary}</p>
            </div>

            {/* Factor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {d.macroSensitivity.factors.map((factor, i) => {
                const dirColor = factor.direction === "Tailwind" ? "text-emerald-400" : factor.direction === "Headwind" ? "text-red-400" : "text-zinc-400";
                const dirBg = factor.direction === "Tailwind" ? "bg-emerald-900/20 border-emerald-800/40" : factor.direction === "Headwind" ? "bg-red-900/20 border-red-800/40" : "bg-zinc-800/40 border-zinc-700";
                const impactColor = factor.impact === "High" ? "text-red-300 bg-red-900/40" : factor.impact === "Medium" ? "text-amber-300 bg-amber-900/40" : "text-zinc-300 bg-zinc-800";
                const DirIcon = factor.direction === "Tailwind" ? ArrowUpRight : factor.direction === "Headwind" ? ArrowDownRight : Minus;
                return (
                  <Card key={i} className={`${dirBg} border`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">{factor.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-[10px] ${impactColor} px-1.5 py-0`}>{factor.impact}</Badge>
                          <DirIcon className={`w-4 h-4 ${dirColor}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs font-medium ${dirColor}`}>{factor.direction}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-2">{factor.currentTrend}</p>
                      <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-700/50">
                        <ChevronRight className="w-3 h-3 text-cyan-500 shrink-0" />
                        <span className="text-[11px] text-cyan-400/80">{factor.transmissionChannel}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Macro Factor Impact Summary Bar */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-400 uppercase tracking-wider">Factor Direction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {d.macroSensitivity.factors.map((factor, i) => {
                    const barColor = factor.direction === "Tailwind" ? "bg-emerald-500" : factor.direction === "Headwind" ? "bg-red-500" : "bg-zinc-500";
                    const impactWidth = factor.impact === "High" ? 90 : factor.impact === "Medium" ? 60 : 30;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 w-40 shrink-0 truncate">{factor.name}</span>
                        <div className="flex-1 h-3 bg-zinc-800 overflow-hidden">
                          <div className={`h-full ${barColor} transition-all duration-700`} style={{ width: `${impactWidth}%` }} />
                        </div>
                        <span className={`text-xs font-medium w-16 text-right ${factor.direction === "Tailwind" ? "text-emerald-400" : factor.direction === "Headwind" ? "text-red-400" : "text-zinc-400"}`}>
                          {factor.direction}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Ripple Effects / Transmission Table */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-400 uppercase tracking-wider">Macro Ripple Effects — Transmission Chains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {d.macroSensitivity.rippleEffects.map((ripple, i) => (
                    <div key={i} className="border border-zinc-800 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-sm font-medium text-zinc-200">{ripple.event}</span>
                      </div>
                      <div className="ml-5 space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider w-14 shrink-0 mt-0.5">Direct</span>
                          <span className="text-xs text-zinc-300">{ripple.directEffect}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] text-cyan-500 uppercase tracking-wider w-14 shrink-0 mt-0.5">Ripple</span>
                          <span className="text-xs text-zinc-400">{ripple.secondaryImpact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STATEMENTS */}
          <TabsContent value="statements" className="space-y-6">
            <SectionTitle icon={FileText} title="Financial Statements" subtitle="Income statement, balance sheet, and cash flow — last 4 years" />
            <Tabs defaultValue="income" className="space-y-4">
              <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-auto gap-0.5">
                <TabsTrigger value="income" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400 text-xs px-3 py-1.5 gap-1.5 text-zinc-400">
                  <ReceiptText className="w-3 h-3" />Income Statement
                </TabsTrigger>
                <TabsTrigger value="balance" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400 text-xs px-3 py-1.5 gap-1.5 text-zinc-400">
                  <Wallet className="w-3 h-3" />Balance Sheet
                </TabsTrigger>
                <TabsTrigger value="cashflow" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400 text-xs px-3 py-1.5 gap-1.5 text-zinc-400">
                  <FileText className="w-3 h-3" />Cash Flow
                </TabsTrigger>
              </TabsList>

              {/* Income Statement */}
              <TabsContent value="income">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="pt-4">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-[11px] text-zinc-400 w-44">Metric ($M)</TableHead>
                            {d.statements.income.map(r => (
                              <TableHead key={r.year} className="text-[11px] text-zinc-400 text-right">{r.year}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { label: "Revenue", key: "revenue" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Cost of Revenue", key: "cogs" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Gross Profit", key: "grossProfit" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "Gross Margin", key: "grossMargin" as const, format: (v: number) => `${v.toFixed(1)}%` },
                            { label: "R&D", key: "rd" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "SG&A", key: "sga" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Operating Income", key: "operatingIncome" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "Operating Margin", key: "operatingMargin" as const, format: (v: number) => `${v.toFixed(1)}%` },
                            { label: "EBITDA", key: "ebitda" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Interest Expense", key: "interestExpense" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Tax Rate", key: "taxRate" as const, format: (v: number) => `${v.toFixed(1)}%` },
                            { label: "Net Income", key: "netIncome" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "Net Margin", key: "netMargin" as const, format: (v: number) => `${v.toFixed(1)}%` },
                            { label: "EPS (Basic)", key: "eps" as const, format: (v: number) => `$${v.toFixed(2)}` },
                            { label: "Shares Basic (M)", key: "sharesBasic" as const, format: (v: number) => `${(v/1000).toFixed(0)}B` },
                          ].map(row => (
                            <TableRow key={row.label} className={`border-zinc-800 ${row.highlight ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"}`}>
                              <TableCell className={`text-xs font-medium ${row.highlight ? "text-zinc-100" : "text-zinc-400"}`}>{row.label}</TableCell>
                              {d.statements.income.map(r => (
                                <TableCell key={r.year} className={`text-xs text-right font-mono ${row.highlight ? "text-cyan-300 font-semibold" : "text-zinc-300"}`}>
                                  {row.format(r[row.key] as number)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Balance Sheet */}
              <TabsContent value="balance">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="pt-4">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-[11px] text-zinc-400 w-44">Metric ($M)</TableHead>
                            {d.statements.balance.map(r => (
                              <TableHead key={r.year} className="text-[11px] text-zinc-400 text-right">{r.year}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { label: "ASSETS", section: true },
                            { label: "Cash & Equivalents", key: "cash" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Receivables", key: "receivables" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Inventory", key: "inventory" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Total Current Assets", key: "currentAssets" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "PP&E", key: "ppe" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Goodwill", key: "goodwill" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Intangibles", key: "intangibles" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Total Assets", key: "totalAssets" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "LIABILITIES", section: true },
                            { label: "Current Liabilities", key: "currentLiabilities" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "Long-Term Debt", key: "longTermDebt" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Total Liabilities", key: "totalLiabilities" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "EQUITY", section: true },
                            { label: "Retained Earnings", key: "retainedEarnings" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B` },
                            { label: "Total Equity", key: "totalEquity" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "Book Value / Share", key: "bookValue" as const, format: (v: number) => `$${v.toFixed(2)}` },
                          ].map((row, idx) => (
                            row.section ? (
                              <TableRow key={idx} className="border-zinc-800 bg-zinc-800/60">
                                <TableCell colSpan={d.statements.balance.length + 1} className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 py-1.5">{row.label}</TableCell>
                              </TableRow>
                            ) : (
                              <TableRow key={row.label} className={`border-zinc-800 ${row.highlight ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"}`}>
                                <TableCell className={`text-xs font-medium ${row.highlight ? "text-zinc-100" : "text-zinc-400"}`}>{row.label}</TableCell>
                                {d.statements.balance.map(r => (
                                  <TableCell key={r.year} className={`text-xs text-right font-mono ${row.highlight ? "text-cyan-300 font-semibold" : "text-zinc-300"}`}>
                                    {row.format!(r[row.key!] as number)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cash Flow */}
              <TabsContent value="cashflow">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="pt-4">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-[11px] text-zinc-400 w-44">Metric ($M)</TableHead>
                            {d.statements.cashflow.map(r => (
                              <TableHead key={r.year} className="text-[11px] text-zinc-400 text-right">{r.year}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { label: "OPERATING", section: true },
                            { label: "Operating Cash Flow", key: "operatingCF" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "INVESTING", section: true },
                            { label: "Capital Expenditures", key: "capex" as const, format: (v: number) => `$(${(Math.abs(v)/1000).toFixed(1)}B)` },
                            { label: "Free Cash Flow", key: "freeCashFlow" as const, format: (v: number) => `$${(v/1000).toFixed(1)}B`, highlight: true },
                            { label: "Acquisitions", key: "acquisitions" as const, format: (v: number) => v === 0 ? "—" : `$(${(Math.abs(v)/1000).toFixed(1)}B)` },
                            { label: "FINANCING", section: true },
                            { label: "Dividends Paid", key: "dividendsPaid" as const, format: (v: number) => v === 0 ? "—" : `$(${(Math.abs(v)/1000).toFixed(1)}B)` },
                            { label: "Share Buybacks", key: "buybacks" as const, format: (v: number) => v === 0 ? "—" : `$(${(Math.abs(v)/1000).toFixed(1)}B)` },
                            { label: "Debt Issuance", key: "debtIssuance" as const, format: (v: number) => v === 0 ? "—" : `$${(v/1000).toFixed(1)}B` },
                            { label: "Debt Repayment", key: "debtRepayment" as const, format: (v: number) => v === 0 ? "—" : `$(${(Math.abs(v)/1000).toFixed(1)}B)` },
                            { label: "Net Change in Cash", key: "netChange" as const, format: (v: number) => `${v >= 0 ? "+" : "-"}$${(Math.abs(v)/1000).toFixed(1)}B`, highlight: true },
                          ].map((row, idx) => (
                            row.section ? (
                              <TableRow key={idx} className="border-zinc-800 bg-zinc-800/60">
                                <TableCell colSpan={d.statements.cashflow.length + 1} className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 py-1.5">{row.label}</TableCell>
                              </TableRow>
                            ) : (
                              <TableRow key={row.label} className={`border-zinc-800 ${row.highlight ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"}`}>
                                <TableCell className={`text-xs font-medium ${row.highlight ? "text-zinc-100" : "text-zinc-400"}`}>{row.label}</TableCell>
                                {d.statements.cashflow.map(r => (
                                  <TableCell key={r.year} className={`text-xs text-right font-mono ${row.highlight ? "text-cyan-300 font-semibold" : "text-zinc-300"}`}>
                                    {row.format!(r[row.key!] as number)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* PORTFOLIO */}
          <TabsContent value="portfolio" className="space-y-6">
            <SectionTitle icon={Briefcase} title="Portfolio Tracker" subtitle="Track and compare your holdings" />

            {portfolio.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6 text-center">
                  <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-300 mb-4">No positions added yet. Click "Add to Portfolio" above to track stocks.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-cyan-400">{portfolio.length}</p>
                      <p className="text-xs text-zinc-500 mt-1">Positions</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-emerald-400">{(portfolio.reduce((sum, p) => sum + p.data.dcf.upside, 0) / portfolio.length).toFixed(1)}%</p>
                      <p className="text-xs text-zinc-500 mt-1">Avg DCF Upside</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-yellow-400">{portfolio.filter(p => p.data.moat.moatRating === "Wide").length}</p>
                      <p className="text-xs text-zinc-500 mt-1">Wide Moats</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-purple-400">{portfolio.filter(p => p.data.quality.roic3yAvg > 15).length}</p>
                      <p className="text-xs text-zinc-500 mt-1">High ROIC</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-zinc-200">Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                          <TableHead className="text-[10px] text-zinc-400">Ticker</TableHead>
                          <TableHead className="text-[10px] text-zinc-400">Rating</TableHead>
                          <TableHead className="text-[10px] text-zinc-400 text-right">Price</TableHead>
                          <TableHead className="text-[10px] text-zinc-400 text-right">DCF Up</TableHead>
                          <TableHead className="text-[10px] text-zinc-400 text-right">ROIC</TableHead>
                          <TableHead className="text-[10px] text-zinc-400">Moat</TableHead>
                          <TableHead className="text-[10px] text-zinc-400">Added</TableHead>
                          <TableHead className="text-[10px] text-zinc-400">Notes</TableHead>
                          <TableHead className="text-[10px] text-zinc-400"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {portfolio.map(p => (
                          <TableRow key={p.ticker} className="border-zinc-800">
                            <TableCell className="text-sm font-semibold text-cyan-400">{p.ticker}</TableCell>
                            <TableCell><RatingBadge rating={p.data.verdict.rating} /></TableCell>
                            <TableCell className="text-xs text-right">${p.data.price.current.toFixed(2)}</TableCell>
                            <TableCell className={`text-xs text-right font-semibold ${p.data.dcf.upside > 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt.pct(p.data.dcf.upside)}</TableCell>
                            <TableCell className="text-xs text-right text-zinc-400">{p.data.quality.roic3yAvg.toFixed(1)}%</TableCell>
                            <TableCell className="text-xs"><Badge variant="outline" className={`text-[10px] ${p.data.moat.moatRating === "Wide" ? "bg-emerald-900/20 border-emerald-800 text-emerald-300" : "bg-yellow-900/20 border-yellow-800 text-yellow-300"}`}>{p.data.moat.moatRating}</Badge></TableCell>
                            <TableCell className="text-xs text-zinc-500">{p.addedDate}</TableCell>
                            <TableCell>
                              <input
                                type="text"
                                value={p.notes}
                                onChange={e => updatePortfolioNotes(p.ticker, e.target.value)}
                                placeholder="Add notes..."
                                className="w-32 bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 px-2 py-1 rounded focus:border-cyan-600 focus:outline-none"
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => removeFromPortfolio(p.ticker)} className="h-6 w-6 p-0 text-red-400 hover:bg-red-900/20 hover:text-red-300">
                                <X className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-zinc-200">ROIC Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={portfolio.map(p => ({ ticker: p.ticker, roic: p.data.quality.roic3yAvg }))} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#71717a" />
                          <YAxis dataKey="ticker" type="category" tick={{ fontSize: 12 }} stroke="#71717a" width={60} />
                          <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                          <Bar dataKey="roic" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-zinc-200">EV/EBITDA Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={portfolio.map(p => ({ ticker: p.ticker, ev: p.data.valuation.evEbitda }))} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#71717a" />
                          <YAxis dataKey="ticker" type="category" tick={{ fontSize: 12 }} stroke="#71717a" width={60} />
                          <RechartsTooltip contentStyle={{ background: "#27272a", border: "1px solid #52525b", borderRadius: "0.5rem" }} />
                          <Bar dataKey="ev" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Chatbot floating panel */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-zinc-900 border border-zinc-700 shadow-2xl flex flex-col" style={{ height: 480 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-zinc-100">Ask about {data?.ticker ?? "your analysis"}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setChatOpen(false)} className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-100">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-cyan-700/60 text-zinc-100"
                      : "bg-zinc-800 text-zinc-200"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 px-3 py-3 border-t border-zinc-800 shrink-0">
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatQuery(); } }}
              placeholder="Ask anything about this stock..."
              className="flex-1 h-8 bg-zinc-800 border-zinc-700 text-xs placeholder:text-zinc-600 focus:border-cyan-600"
            />
            <Button size="sm" onClick={handleChatQuery} className="h-8 w-8 p-0 bg-cyan-600 hover:bg-cyan-500">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Chatbot floating toggle button */}
      <button
        onClick={() => setChatOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg flex items-center justify-center transition-colors no-print"
        title="Ask about this stock"
      >
        {chatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
}
