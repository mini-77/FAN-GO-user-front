import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TripProvider } from './TripContext'
import { ThemeProvider } from './ThemeContext'
import { LanguageProvider } from './LanguageContext'
import SplashView from './SplashView'
import HomeView from './HomeView'
import LoginView from './LoginView'
import SignupView from './SignupView'
import ArtistSelectView from './ArtistSelectView'
import SignupSuccessView from './SignupSuccessView'
import TripDateView from './TripDateView'
import EventSelectView from './EventSelectView'
import ActivityPreferenceView from './ActivityPreferenceView'
import PaceView from './PaceView'
import ConfirmView from './ConfirmView'
import TripGeneratingView from './TripGeneratingView'
import TripReadyView from './TripReadyView'
import ItineraryView from './ItineraryView'
import ScheduleTableView from './ScheduleTableView'
import ItineraryEditView from './ItineraryEditView'
import FeedbackView from './FeedbackView'
import HistoryView from './HistoryView'
import MyPageView from './MyPageView'
import EditProfileView from './EditProfileView'
import ScreenIndex from './ScreenIndex'
import RequireEvent from './RequireEvent'
import ChatbotView from './ChatbotView'
import ChatbotFab from './ChatbotFab'
import ScrollToTop from './ScrollToTop'

function App() {
  return (
    <TripProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<SplashView />} />
              <Route path="/home" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/signup" element={<SignupView />} />
              <Route path="/signup/artists" element={<ArtistSelectView />} />
              <Route path="/signup/success" element={<SignupSuccessView />} />
              <Route path="/trip/events" element={<EventSelectView />} />
              <Route
                path="/trip/date"
                element={
                  <RequireEvent>
                    <TripDateView />
                  </RequireEvent>
                }
              />
              <Route path="/trip/activities" element={<ActivityPreferenceView />} />
              <Route path="/trip/pace" element={<PaceView />} />
              <Route path="/trip/confirm" element={<ConfirmView />} />
              <Route
                path="/trip/generating"
                element={
                  <RequireEvent>
                    <TripGeneratingView />
                  </RequireEvent>
                }
              />
              <Route
                path="/trip/ready"
                element={
                  <RequireEvent>
                    <TripReadyView />
                  </RequireEvent>
                }
              />
              <Route path="/trip/itinerary" element={<ItineraryView />} />
              <Route path="/trip/schedule" element={<ScheduleTableView />} />
              <Route path="/trip/itinerary/edit" element={<ItineraryEditView />} />
              <Route path="/trip/feedback" element={<FeedbackView />} />
              <Route path="/trip/history" element={<HistoryView />} />
              <Route path="/account" element={<MyPageView />} />
              <Route path="/account/edit" element={<EditProfileView />} />
              <Route path="/screens" element={<ScreenIndex />} />
              <Route path="/chat" element={<ChatbotView />} />
            </Routes>
            <ChatbotFab />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TripProvider>
  )
}

export default App
