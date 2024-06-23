import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  uploading: boolean = false;
  showImageModal: boolean = false;
  modalImage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.chatService.getMessages().subscribe((messages: any[]) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message = { sender: 'user', text: this.newMessage };
      this.messages.push(message);
      this.chatService.sendMessage(message).subscribe({
        next: response => {
          this.messages.push(response);
        },
        error: err => {
          console.error('Error sending message:', err);
        }
      });
      this.newMessage = '';
    }
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.chatService.uploadFile(file).subscribe({
        next: response => {
          const fileUrl = response.filename; // Adjust according to the response
          const message = { sender: 'user', text: `<a href="${fileUrl}" target="_blank">Uploaded file</a>`, attachment: fileUrl };
          this.messages.push(message);
          this.chatService.sendMessage(message).subscribe({
            next: res => {
              this.messages.push(res);
            },
            error: err => {
              console.error('Error sending message:', err);
            }
          });
          this.uploading = false;
        },
        error: err => {
          console.error('Error uploading file:', err);
          this.uploading = false;
        }
      });
    }
  }

  closeImageModal() {
    this.showImageModal = false;
  }
}
