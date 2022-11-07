import { AboutComponent } from './about.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('About Component', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Loads with a title and highlight', () => {
    const title: HTMLElement = fixture.debugElement.query(By.css('[data-cy=page-title]')).nativeElement;
    expect(title.innerText).toBe('About');
    expect(title.style.backgroundColor).toBe('skyblue');
  });

  it('should have an h3 element that reads "Quote of the day:"', () => {
    const h3: HTMLElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(h3.innerText).toBe('Quote of the day:');
  });
});
