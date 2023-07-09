import { useEffect, useState } from 'react';
import { Client, Frame, over } from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs.js';
import * as S from './styles';

interface ChatMessage {
  senderName: string;
  receiverName?: string;
  message?: string;
  status: string;
}

interface PrivateChat {
  [senderName: string]: ChatMessage[];
}


let stompClient: Client | null = null;

const ChatRoom = (): JSX.Element => {

  const [privateChats, setPrivateChats] = useState<PrivateChat>({});     
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]); 
  const [tab, setTab] = useState<string>("CHATROOM");


  const [userData, setUserData] = useState<{
    username: string;
    receiverName: string;
    connected: boolean;
    message: string;
  }>({
    username: '',
    receiverName: '',
    connected: false,
    message: ''
  });

  const connect = (): void => {
    const sock = new SockJS('http://localhost:8080/chat-websocket');
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = (): void => {
    setUserData({...userData, "connected": true});
    stompClient?.subscribe('/chat-room/messages', onMessageReceived);
    stompClient?.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
    userJoin();
  };

  const userJoin = (): void => {
    const chatMessage: ChatMessage = {
      senderName: userData.username,
      status: "JOIN"
    };
    stompClient?.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload: { body: string; }): void => {
    const payloadData: ChatMessage = JSON.parse(payload?.body) as ChatMessage;
    switch(payloadData?.status) {
      case "JOIN":
        if (!privateChats[payloadData.senderName]) {
          privateChats[payloadData.senderName] = [];
          setPrivateChats({...privateChats});
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };
    
  const onPrivateMessage = (payload: { body: string; }): void => {
    const payloadData: ChatMessage = JSON.parse(payload.body) as ChatMessage;
    if (privateChats[payloadData.senderName]) {
      privateChats[payloadData.senderName]?.push(payloadData);
      setPrivateChats({...privateChats});
    } else {
      const list: ChatMessage[] = [];
      list.push(payloadData);
      privateChats[payloadData.senderName] = list;
      setPrivateChats({...privateChats});
    }
  };

  const onError = (err: string | Frame): void => {
    console.log(err);
  };

  const handleMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setUserData({...userData, "message": value});
  };

  const sendValue = (): void => {
    if (stompClient) {
      const chatMessage: ChatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE"
      };
  
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({...userData, "message": ""});
    }
  };

  const sendPrivateValue = (): void => {
    if (stompClient) {

      const chatMessage: ChatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE"
      };
          
      if (userData.username !== tab) {
        privateChats[tab].push(chatMessage);
        setPrivateChats({...privateChats});
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({...userData, "message": ""});
    }
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setUserData({...userData, "username": value});
  };

  const handleUsernameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") registerUser();
  };

  const handleMessageKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, isPrivate: boolean): void => {
    if (event.key === "Enter") {
      if (isPrivate) sendPrivateValue();
      else sendValue();
    }
  };

  const registerUser = (): void => {
    connect();
  };

  return (
    <S.Container>
      <S.Title>Chat Zen</S.Title>
      {userData.connected ? (
        <S.ChatBox>
          <S.MemberList>
            <ul>
              <S.Member onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" ? "active" : ""}`}>Sala de bate-papo</S.Member>
              {[...Object.keys(privateChats)].map((name, index) => (
                <S.Member onClick={() => { setTab(name) }} className={`member ${tab === name ? "active" : ""}`} key={index}>{name}</S.Member>
              ))}
            </ul>
          </S.MemberList>
          {tab === "CHATROOM" && (
            <S.ChatContent>
              <S.ChatMessages className='chat-messages'>
                {publicChats?.map((chat, index) => (
                  <li className={`message ${chat?.senderName === userData?.username ? "true": ""}`} key={index}>
                    {chat?.senderName !== userData.username && <div className="avatar">{chat?.senderName}</div>}
                    <div className="message-data">{chat?.message}</div>
                    {chat?.senderName === userData.username && <div className="avatar self">{chat?.senderName}</div>}
                  </li>
                ))}
              </S.ChatMessages>

              <S.SendMessage>
                <S.InputMessage 
                  type="text" 
                  className="input-message" 
                  placeholder="Digite a mensagem" 
                  value={userData.message} 
                  onChange={handleMessage} 
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleMessageKeyDown(event, false)}
                  /> 
                <S.SendButton type="button" className="send-button" onClick={sendValue}>Enviar</S.SendButton>
              </S.SendMessage>
            </S.ChatContent>
          )}
          {tab !== "CHATROOM" && (
            <S.ChatContent>
              <S.ChatMessages>
                {[...privateChats[tab]].map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username ? "self" : ""}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </S.ChatMessages>

              <S.SendMessage>
                <S.InputMessage 
                  type="text" 
                  className="input-message" 
                  placeholder="Digite a mensagem" 
                  value={userData.message} 
                  onChange={handleMessage} 
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleMessageKeyDown(event, true)}
                  /> 
                <S.SendButton type="button" className="send-button" onClick={sendPrivateValue}>Enviar</S.SendButton>
              </S.SendMessage>
            </S.ChatContent>
          )}
        </S.ChatBox>
      ) : (
        <S.Register>
         <input
            id="user-name"
            placeholder="Digite seu nome"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            onKeyDown={handleUsernameKeyDown}
          />
          <S.Button type="button" onClick={registerUser}>
            Conectar
          </S.Button> 
        </S.Register>
      )}
    </S.Container>
  );
};

export default ChatRoom;
