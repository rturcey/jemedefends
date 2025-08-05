import * as React from 'react';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';
function PageSection({
  id,
  title,
  description,
  children,
}: React.PropsWithChildren<{ id?: string; title: string; description?: string }>) {
  return (
    <Section id={id}>
      <Container>
        <SectionHeader title={title} description={description} />
        {children}
      </Container>
    </Section>
  );
}
export default PageSection;
