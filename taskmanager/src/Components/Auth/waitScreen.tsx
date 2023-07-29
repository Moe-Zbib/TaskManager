import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const WaitScreen: React.FC = () => {
  const [waitingTime, setWaitingTime] = useState(30); // Set the initial waiting time

  useEffect(() => {
    // Decrement the waiting time every second
    const timer = setInterval(() => {
      setWaitingTime((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  return (
    <Container>
      <Heading>Please wait...</Heading>
      <p>
        You have exceeded the maximum login attempts. Please wait for{" "}
        {waitingTime} seconds before trying again.
      </p>
    </Container>
  );
};

export default WaitScreen;
