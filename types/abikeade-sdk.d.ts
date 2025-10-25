declare module 'abikeade-sdk' {
  export class Admin {
    constructor();
    setToken(token: string): void;
    
    account: {
      login(options: { formData: { username: string; password: string }; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      logout(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      loginStatus(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      getProfile(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      changePassword(options: { formData: { old_password: string; new_password: string }; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateProfile(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      forgotPassword(options: { formData: { email: string }; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    site: {
      siteInfo(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateSite(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    gallery: {
      imageList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      addImage(options: { formData: FormData; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateImage(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      deleteImage(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    room: {
      roomList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      addRoom(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateRoom(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateRoomImage(options: { formData: FormData; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      assignRoom(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      terminateRoom(options: { formData: { room_id: number }; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      deleteRoom(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateRoomGallery(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    user: {
      userList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      userStatus(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      verify(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      verifyAgreement(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      userTransactions(options: { params: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    wallet: {
      balance(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      bankList(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      verifyAccount(options: { params: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    transaction: {
      transactionList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      refundList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      initiateRefund(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      makeTransfer(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    message: {
      messageList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      reply(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    broadcast: {
      broadcastList(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      send(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
    
    notification: {
      list(options: { params?: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
  }
  
  export class Client {
    constructor();
    setToken(token: string): void;
    
    account: {
      getProfile(options: { onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      updateProfile(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
      changePassword(options: { formData: any; onSuccess: (data: any) => void; onError: (error: any) => void }): void;
    };
  }
}
