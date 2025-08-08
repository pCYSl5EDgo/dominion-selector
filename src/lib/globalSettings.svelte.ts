export type GlobalSettings = {
 shouldDisplayBannedItems: boolean;
 copyListSeparator: string;
};

export let globalSettings: GlobalSettings = $state({
 shouldDisplayBannedItems: false,
 copyListSeparator: "\r\n",
});