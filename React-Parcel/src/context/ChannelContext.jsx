import { createContext, useState, useEffect } from "react";

export const ChannelContext = createContext();

export function ChannelProvider({ children}) {
    const [channels, setChannels] = useState([]);
    const [search, setSearch] = useState("");
}