import StorySection from '@/components/story/StorySection';
import ShowcaseSection from '@/components/showcase/ShowcaseSection';
import LecturerSection from '@/components/lecturer/LecturerSection';
import StudentsSection from '@/components/students/StudentsSection';
import ThanksSection from '@/components/thanks/ThanksSection';
import SiteFooter from '@/components/footer/SiteFooter';

export default function Home() {
  return (
    <>
      <main>
        <StorySection />
        <ShowcaseSection />
        <LecturerSection />
        <StudentsSection />
        <ThanksSection />
      </main>
      <SiteFooter />
    </>
  );
}
