import styled from 'styled-components';
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { color, space } from '@styles/theme';
import logo from '@public/logo.png';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};
const Page = styled.div`
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

const BgImgAndContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1100px) {
    padding: 0 ${space(4)};
    width: 100vw;
    align-self: flex-end;
  }
`;

const BackgroundImg = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url('/popcorn_background.png');
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 101%; // to cover the pseudo-element
    height: 100%;
    background: ${color('dark', 300)};
    opacity: 85%;
  }

  @media (min-width: 1100px) {
    width: 60%;
    opacity: 100%;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 101%;
      height: 100%;
      opacity: 100%;
      background: linear-gradient(
        to right,
        rgba(30, 33, 43, 0.75),
        rgba(30, 33, 43, 1)
      );
    }
  }
`;

const ContentContainer = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 1100px) {
    width: 35%;
    align-self: flex-end;
    margin-right: ${space(4)};
  }
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

export function Layout({ children }: LayoutProps) {
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
      <BgImgAndContentContainer>
        <BackgroundImg></BackgroundImg>
        <ContentContainer>
          <Title>Tired of the endless scrolling through Netflix?</Title>
          <SupportingText>Search Less. Stream More.</SupportingText>
          {children}
        </ContentContainer>
      </BgImgAndContentContainer>
    </Page>
  );
}
