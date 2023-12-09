import React, { useEffect, useState } from 'react';
import immer, { produce } from 'immer';
import { EventEmitter } from 'eventemitter3';

interface ProviderProps {
  children: React.ReactNode;
}

type GetProps<Comp extends React.ComponentType> =
  Comp extends React.ComponentType<infer Props> ? Props : never;

export class StateManager<State> {
  private context: React.Context<State>;
  private emitter = new EventEmitter<{
    commit: (tabs: State) => void;
  }>();

  constructor(private state: State) {
    this.context = React.createContext(state);
  }

  setState(state: State) {
    this.state = state;
    this.emitter.emit('commit', state);
  }

  getState() {
    return this.state;
  }

  produce(
    cb: (state: immer.Draft<State>) => immer.Draft<State> | void | undefined,
  ) {
    const newState = produce(this.state, draft => {
      return cb(draft);
    });
    this.setState(newState);
  }

  useState() {
    return React.useContext(this.context);
  }

  Provider = ({ children }: ProviderProps) => {
    const [state, setState] = useState(this.state);

    useEffect(() => {
      this.emitter.on('commit', setState);
      return () => {
        this.emitter.off('commit');
      };
    }, []);

    return (
      <this.context.Provider value={state}>{children}</this.context.Provider>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hoc = <T extends React.ComponentType<any>>(Comp: T) => {
    const Enhance = (props: GetProps<T>) => {
      return (
        <this.Provider>
          <Comp {...props} />
        </this.Provider>
      );
    };
    return Enhance;
  };
}
