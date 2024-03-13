export type IUserLogin = {
  phoneNumber: string;
  password: string;
  devicesInfo?: IDeviceInfo;
};

export type IDeviceInfo = {
  userId: string;
  devicesId?: string;
  devicesModel?: string;
  devicesType?: string;
  devicesVendor?: string;
  browserName?: string;
  browserVersion?: string;
  engineName?: string;
  engineVersion?: string;
  osName?: string;
  osVersion?: string;
  cpuArchitecture?: string;
  agentClient?: string;
  updatedAt: Date;
};

export type IDeleteUserDevice = {
  userId: string;
};
