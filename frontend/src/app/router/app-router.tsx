import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { PageLoader } from '@/components/feedback/page-loader'
import { AppShell } from '@/components/layout/app-shell'

const HomePage = lazy(() => import('@/pages/home-page'))
const ExplorePage = lazy(() => import('@/pages/explore-page'))
const PlaceDetailPage = lazy(() => import('@/pages/place-detail-page'))
const SavedPage = lazy(() => import('@/pages/saved-page'))
const ItineraryPage = lazy(() => import('@/pages/itinerary-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))

export const AppRouter: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="kham-pha" element={<ExplorePage />} />
        <Route path="dia-diem/:slug" element={<PlaceDetailPage />} />
        <Route path="da-luu" element={<SavedPage />} />
        <Route path="lich-trinh" element={<ItineraryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
)
