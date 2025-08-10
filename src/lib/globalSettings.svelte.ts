import { browser } from "$app/environment";

export type GlobalSettings = {
 shouldDisplayBannedItems: boolean;
 copyListSeparator: string;
};

export let globalSettings: GlobalSettings = $state({
 shouldDisplayBannedItems: false,
 copyListSeparator: "\r\n",
});

export const calculateSeparatorKind = (settings: GlobalSettings) => {
 switch (settings.copyListSeparator) {
  case "\r\n":
   return "crlf";
  case " ":
   return "space";
  case ",":
   return "comma";
  default:
   return "text";
 }
}

export const shouldDisplayName = "global-settings-should-display-banned-items";
export const separatorName = "global-settings-copy-list-separator";
if (browser) {
 globalSettings.shouldDisplayBannedItems = self.localStorage.getItem(shouldDisplayName) === "1";
 globalSettings.copyListSeparator = self.localStorage.getItem(separatorName) ?? "\r\n";
}
