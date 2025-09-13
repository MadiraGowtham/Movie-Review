import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

const HeroContainer = styled.section`
  position: relative;
  height: 80vh;
  min-height: 500px;
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1489599808417-2a4b4a3a0a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80') center/cover;
    z-index: -1;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 20px;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #cccccc;
  margin-bottom: 40px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  outline: none;

  &.primary {
    background: linear-gradient(135deg, #e50914, #f40612);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.3);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const StatsContainer = styled.div`
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #e50914;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #cccccc;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Hero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>
          Discover Your Next
          <br />
          Favorite Movie
        </HeroTitle>
        <HeroSubtitle>
          Join thousands of movie enthusiasts in discovering, rating, and reviewing 
          the best films. Find your next cinematic adventure today.
        </HeroSubtitle>
        <HeroButtons>
          <HeroButton to="/movies" className="primary">
            <FaPlay />
            Browse Movies
          </HeroButton>
          <HeroButton to="/register" className="secondary">
            <FaInfoCircle />
            Join Now
          </HeroButton>
        </HeroButtons>
        
        <StatsContainer>
          <StatItem>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Movies</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Reviews</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>5K+</StatNumber>
            <StatLabel>Users</StatLabel>
          </StatItem>
        </StatsContainer>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
