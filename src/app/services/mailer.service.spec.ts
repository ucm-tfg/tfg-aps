import { TestBed } from '@angular/core/testing';

import { MailerService } from './mailer.service';

xdescribe('MailerService', () => {
  let service: MailerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
