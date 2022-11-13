import { useEffect } from 'react';
import QuadraticUI from '../ui/QuadraticUI';
import { RecoilRoot } from 'recoil';
import { useLoading } from '../contexts/LoadingContext';
import { QuadraticLoading } from '../ui/QuadtraticLoading';
import { loadPython } from '../core/computations/python/loadPython';
import { TopBarLoading } from '../ui/components/TopBarLoading';
import { WelcomeComponent } from './WelcomeComponent';
import { AnalyticsProvider } from './AnalyticsProvider';
import { loadAssets } from '../core/gridGL/loadAssets';
import { isMobileOnly } from 'react-device-detect';
import { debugSkipPythonLoad } from '../debugFlags';

export default function QuadraticApp() {
  const { loading, incrementLoadingCount } = useLoading();

  useEffect(() => {
    if (loading) {
      if (!isMobileOnly && !debugSkipPythonLoad) {
        // Only load Python not on mobile
        loadPython().then(() => {
          incrementLoadingCount();
        });
      } else {
        // Don't load python on mobile
        incrementLoadingCount();
      }
      loadAssets().then(() => {
        incrementLoadingCount();
      });
    }
  }, [loading, incrementLoadingCount]);

  return (
    <RecoilRoot>
      {/* Provider for Analytics. Only used when running in Quadratic Cloud. */}
      <AnalyticsProvider></AnalyticsProvider>
      {/* Welcome Component for first time users */}
      {!loading && <WelcomeComponent></WelcomeComponent>}
      {/* Provider of All React UI Components */}
      {!loading && <QuadraticUI></QuadraticUI>}
      {/* ToBarLoading allows window to be moved while loading in electron */}
      {loading && <TopBarLoading></TopBarLoading>}
      {/* Loading screen */}
      {loading && <QuadraticLoading></QuadraticLoading>}
    </RecoilRoot>
  );
}
