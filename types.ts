export interface Location {
  latitude: number;
  longitude: number;
}

export interface ParsedResponse {
  emergencyNumbers?: string;
  immediateAction?: string;
  firstAid?: string;
  localHelp?: string;
}

export interface HistoryEntry {
  id: string;
  userInput: string;
  rawResponse: string;
  timestamp: string;
}

export interface GroundingChunk {
  maps: {
    uri: string;
    title: string;
  };
}
