import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Input } from '../components/Input';
import { InputButton } from '../components/InputButton';
import { Output } from '../components/Output';
import { Sources } from '../components/Sources';
import { useConversation } from '../hooks/useConversation';
import { useStream } from '../hooks/useStream';
import { title, suggestions } from '../../config';
import type { FormEventHandler, ChangeEventHandler } from 'react';
import React from "react";
const inter = Inter({ weight: '300', subsets: ['latin'] });

export default function Main() {
  const [inputValue, setInputValue] = useState('');
  const [startStream, isStreaming, outputStream, metadata] = useStream();
  const [conversation, dispatch] = useConversation();
  const scrollableElement = useRef<HTMLDivElement>(null);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = event => {
    if (event) event.preventDefault();
    if (inputValue.trim().length > 0) dispatch({ type: 'setInput', value: inputValue });
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = event =>
    event.target instanceof HTMLInputElement && setInputValue(event.target.value);

  const toggleSuggestions = () => setSuggestionsVisible(!isSuggestionsVisible);

  useEffect(() => {
    if (outputStream.length > 0 && !isStreaming) {
      dispatch({ type: 'commit', value: outputStream, metadata });
    }
  }, [isStreaming, outputStream]);

  useEffect(() => {
    if (scrollableElement.current) {
      scrollableElement.current.scrollTop = scrollableElement.current.scrollHeight;
    }
  }, [conversation.input, outputStream, isSuggestionsVisible]);

  useEffect(() => {
    if (conversation.input.length > 0 && !isStreaming) {
      startStream(conversation.input, conversation);
      setInputValue('');
    }
  }, [conversation.input]);

  return (
    <main className={`h-screen ${inter.className}`}>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-full relative flex flex-col justify-between bg-gray-50 text-gray-900">
  <header className="flex flex-row items-center justify-between py-4 px-6 bg-black shadow">
    <h1 className="text-4xl font-bold">{title}</h1>
    
  </header>

  <div
    className="flex-grow overflow-y-auto flex flex-col gap-4 pb-2 px-6"
    ref={scrollableElement}>
    {conversation?.history.map((interaction, index) => (
      <React.Fragment key={index}>
        <Input>{interaction.input}</Input>
        <Output text={interaction.output} />
        {index === conversation.history.length - 1 ? <Sources metadata={interaction.metadata} /> : null}
      </React.Fragment>
    ))}

    {conversation.input ? <Input>{conversation.input}</Input> : null}

    <Output text={outputStream} />
  </div>

  <form
    className="flex flex-col gap-4 text-xl bg-gray-800 p-4 pt-6 border-t-2 border-gray-700 text-white"
    onSubmit={onSubmit}>
    {isSuggestionsVisible && (
      <ul
        className="list-disc list-inside mb-2 cursor-pointer"
        onClick={event => {
          dispatch({ type: 'setInput', value: event.target.innerText });
          toggleSuggestions();
        }}>
        {suggestions.map((suggestion, idx) => (
          <li key={idx}>
            <button className="italic text-sm py-1 hover:underline hover:text-blue-300">{suggestion}</button>
          </li>
        ))}
      </ul>
    )}

    <input
      type="text"
      name="query"
      placeholder="Ask me something..."
      value={inputValue}
      onChange={onChange}
      className="flex-grow px-4 py-2 rounded-lg shadow-inner bg-white text-black"
    />

    <div className="flex flex-row gap-4 justify-end items-center">
      <button
        type="button"
        className="bg-transparent text-xs italic cursor-pointer hover:text-blue-500"
        onClick={toggleSuggestions}>
        suggestions?
      </button>

      <InputButton type="reset" value="Reset" onClick={() => dispatch({ type: 'reset' })} />
      <InputButton type="submit" value="Send" />
    </div>
  </form>
</div>

    </main>
  );
}