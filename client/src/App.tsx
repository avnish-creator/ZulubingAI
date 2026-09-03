/* Technical Editorial direction: routing preserves the same field-guide chrome, visual hierarchy, and contextual escape routes across every page. */
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useLayoutEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SiteShell } from "@/components/SiteChrome";
import Home from "@/pages/Home";
import { ApproachPage, CollectionPage, CompanyPage, DetailPage, FounderPage, TechnologyPage, EngagementModelsPage, AboutPage, PolicyPage, PlaceholderPage, MissingPage } from "@/pages/ContentPages";
import { ContactPage, TalkToExpertPage } from "@/pages/ContactPages";
import { CoachingPage, CoachingDetailPage } from "@/pages/CoachingPage";
import { WorkshopPage } from "@/pages/WorkshopPage";
import LearningMentorshipPage from "@/pages/LearningMentorship";
import { resetScrollToTop } from "@/lib/navigation";
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    return () => {
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = "auto";
    };
  }, []);

  useLayoutEffect(() => {
    const scrollToTop = () => resetScrollToTop((options) => window.scrollTo(options));
    scrollToTop();
    const frame = window.requestAnimationFrame(scrollToTop);
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return <SiteShell><ScrollToTop /><Switch>
    <Route path="/" component={Home} />
    <Route path="/services" component={() => <CollectionPage type="services" />} />
    <Route path="/services/:slug" component={(params) => <DetailPage kind="service" slug={params.params.slug} />} />
    <Route path="/solutions" component={() => <CollectionPage type="solutions" />} />
    <Route path="/solutions/:slug" component={(params) => <DetailPage kind="solution" slug={params.params.slug} />} />
    <Route path="/industries" component={() => <CollectionPage type="industries" />} />
    <Route path="/industries/:slug" component={(params) => <DetailPage kind="industry" slug={params.params.slug} />} />
    <Route path="/technology" component={TechnologyPage} />
    <Route path="/technology/:slug" component={(params) => <DetailPage kind="technology" slug={params.params.slug} />} />
    <Route path="/case-studies" component={() => <CollectionPage type="case-studies" />} />
    <Route path="/case-studies/:slug" component={(params) => <DetailPage kind="case-study" slug={params.params.slug} />} />
    <Route path="/resources" component={() => <CollectionPage type="resources" />} />
    <Route path="/resources/:slug" component={(params) => <DetailPage kind="resource" slug={params.params.slug} />} />
    <Route path="/about" component={AboutPage} />
    <Route path="/about/founder" component={FounderPage} />
    <Route path="/approach" component={ApproachPage} />
    <Route path="/about/leadership" component={() => <CompanyPage type="leadership" />} />
    <Route path="/about/partners" component={() => <CompanyPage type="partners" />} />
    <Route path="/careers" component={() => <CompanyPage type="careers" />} />
    <Route path="/engagement-models" component={EngagementModelsPage} />
    <Route path="/learning-mentorship" component={LearningMentorshipPage} />
    <Route path="/coaching" component={CoachingPage} />
    <Route path="/coaching/workshop" component={WorkshopPage} />
    <Route path="/coaching/:slug" component={(params) => <CoachingDetailPage slug={params.params.slug} />} />
    <Route path="/contact" component={ContactPage} />
    <Route path="/talk-to-an-expert" component={TalkToExpertPage} />
    <Route path="/privacy-policy" component={() => <PolicyPage type="privacy" />} />
    <Route path="/terms-of-use" component={() => <PolicyPage type="terms" />} />
    <Route path="/cookie-policy" component={() => <PolicyPage type="cookies" />} />
    <Route path="/404" component={MissingPage} />
    <Route component={MissingPage} />
  </Switch></SiteShell>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
