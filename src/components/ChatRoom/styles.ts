import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const Title = styled.h1`
  color: #ed4b05;
  display: flex;
  justify-content: center;
`;

export const Button = styled.button`
  border: none;
  padding: 10px;
  background: #ed4b05;
  color: #fff;
  font-size: 1.2em;
  font-weight: bold;
`;

export const Register = styled.div`
  position: fixed;
  padding: 30px;
  box-shadow: 0 2.8px 2.2px rgba(249, 165, 86, 0.034),0 6.7px 5.3px rgba(249, 165, 86, 0.034),0 12.5px 10px rgba(249, 165, 86, 0.034),0 22.3px 17.9px rgba(249, 165, 86, 0.034),0 41.8px 33.4px rgba(249, 165, 86, 0.034),0 100px 80px rgba(249, 165, 86, 0.034);
  top: 40%;
  left: 40% ;
  display: flex;
  flex-direction: row;
`;

export const ChatBox = styled.div`
  box-shadow: 0 2.8px 2.2px rgba(249, 165, 86, 0.034),0 6.7px 5.3px rgba(249, 165, 86, 0.034),0 12.5px 10px rgba(249, 165, 86, 0.034),0 22.3px 17.9px rgba(249, 165, 86, 0.034),0 41.8px 33.4px rgba(249, 165, 86, 0.034),0 100px 80px rgba(249, 165, 86, 0.034);
  margin: 40px 50px;
  height: 600px;
  padding: 10px;
  display: flex;
  flex-direction: row;
`;

export const MemberList = styled.div`
  width: 20%;
`;

export const ChatContent = styled.div`
  width: 80%;
  margin-left: 10px;
`;

export const ChatMessages = styled.ul`
  height: 80%;
  border: 1px solid #000;

  .avatar {
    padding: 3px 5px;
    border-radius: 5px;
    color: #fff;
    background-color: #6495ed;
  }
  .avatar.self {
    color: #000;
    background-color: #adff2f
  }
  .message {
    padding: 5px;
    width: auto;
    display: flex;
    flex-direction: row;
    margin: 5px 10px;
    color: white;
    box-shadow: 0 3px 10px rgba(100, 148, 237, 0.507)
  }
  .message.self {
    box-shadow: 0 3px 10px rgba(172, 255, 47, 0.396);
  }
  .message-data {
    padding:5px;
  }
  .message.self {
    justify-content: end;
  }
`;

export const SendMessage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const InputMessage = styled.input`
  width:90%;
  border-radius: 50px;
`;

export const SendButton = styled.button`
  width:10%;
  border-radius: 50px;
  margin-left: 5px;
  cursor: pointer;
  border: none;
  padding: 10px;
  background: #ed4b05;
  color:#fff;
  font-size: 1.2em;
  font-weight: bold;
`;

export const Member = styled.li`
  padding: 10px;
  background: #eee;
  border:#000;
  cursor: pointer;
  margin: 5px 2px;
  box-shadow: 0 8px 8px -4px lightblue;

  &.member.active{
    background: #ed4b05;
    color:#fff;
  }

  &.member:hover{
    background: grey;
    color:#fff;
  }
`;
