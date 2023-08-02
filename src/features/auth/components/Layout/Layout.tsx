import styled from 'styled-components';
import React, { ReactNode } from 'react';
import Image from 'next/image';
import popcorn_background from '@public/popcorn_background.png';
import { color, space } from '@styles/theme';
import logo from '@public/logo.png';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};
const Page = styled.div`
  max-width: 400px;
  height: 100vh;
  position: relative;
  margin: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${space(4)};
`;

const Logo = styled.div`
  width: 100%;
  margin: 0;
  padding: ${space(4)} 0;
`;
const ImageCover = styled.div`
  background-color: ${color('dark', 300)};
  opacity: 30%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const ContentContainer = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: ${space(4)};
`;

const SupportingText = styled.h2`
  color: white;
  margin-bottom: ${space(6)};
  text-shadow: ${color('primary', 300)} 2px 2px 2px;
`;

export default function Layout({ children }: LayoutProps) {
  return (
    <Page>
      <Logo>
        <Link href="/">
          <Image
            alt="logo"
            src={logo}
            width="168"
            height="30"
            quality={100}
            priority
          />
        </Link>
      </Logo>
      <Image
        alt="popcorn"
        src={popcorn_background}
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: -1, objectPosition: '-150px' }}
        priority
      />
      <ImageCover />
      <ContentContainer>
        <Title>Tired of the endless scrolling through Netflix?</Title>
        <SupportingText>Search Less. Stream More.</SupportingText>
        {children}
      </ContentContainer>
    </Page>
  );
}
