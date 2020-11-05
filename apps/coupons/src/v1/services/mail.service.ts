import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    public async send(msg: number) {
        console.log(msg);
    }
}
