; Inno Setup Script for P2P Chatter Lite
; This script creates a professional Windows installer

[Setup]
AppId={{3F2504E0-4F89-11D3-9A0C-0305E82C3301}}
AppName=P2P Chatter Lite
AppVersion=1.0.0
AppPublisher=Bad Antics
AppPublisherURL=https://github.com/bad-antics
AppSupportURL=https://github.com/bad-antics/p2p-chatter-lite
AppUpdatesURL=https://github.com/bad-antics/p2p-chatter-lite/releases
DefaultDirName={autopf}\P2P Chatter Lite
DefaultGroupName=P2P Chatter Lite
AllowNoIcons=yes
LicenseFile=LICENSE
OutputDir=dist
OutputBaseFilename=P2P-Chatter-Lite-Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
UninstallDisplayIcon={app}\P2P Chatter Lite.exe
SetupIconFile=assets\icon.ico
WizardSmallImageFile=assets\icon.ico

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
Source: "dist\P2P Chatter Lite-1.0.0.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "dist\resources\*"; DestDir: "{app}\resources"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "LICENSE"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\P2P Chatter Lite"; Filename: "{app}\P2P Chatter Lite.exe"; IconFilename: "{app}\resources\icon.ico"
Name: "{group}\Uninstall P2P Chatter Lite"; Filename: "{uninstallexe}"
Name: "{commondesktop}\P2P Chatter Lite"; Filename: "{app}\P2P Chatter Lite.exe"; IconFilename: "{app}\resources\icon.ico"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\P2P Chatter Lite"; Filename: "{app}\P2P Chatter Lite.exe"; IconFilename: "{app}\resources\icon.ico"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\P2P Chatter Lite.exe"; Description: "{cm:LaunchProgram,P2P Chatter Lite}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: dirifempty; Name: "{app}"
