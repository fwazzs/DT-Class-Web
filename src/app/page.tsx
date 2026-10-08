import StorySection from '@/components/story/StorySection';
import ShowcaseSection from '@/components/showcase/ShowcaseSection';
import LecturerSection from '@/components/lecturer/LecturerSection';
import StudentsSection from '@/components/students/StudentsSection';
import ThanksSection from '@/components/thanks/ThanksSection';
import SiteFooter from '@/components/footer/SiteFooter';
import SmoothScroll from '@/components/ui/SmoothScroll';

export default function Home() {
  return (
    <>
      <SmoothScroll />
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
