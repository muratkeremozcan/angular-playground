import { fakeAsync } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { CanvasComponent } from './canvas.component';
import { ngMocks } from 'ng-mocks';
import { ElementRef } from '@angular/core';

// [9] testing @ViewChild, ngMocks.findInstance(ElementRef) is an effective technique to access @ViewChild

// Note: To make canvas work, had to add an npm package jest-canvas-mock
// Also had to add a specific import to our src/setupTests.ts file: import 'jest-canvas-mock'

describe('Canvas component', () => {
  let component: CanvasComponent;
  let spectator: Spectator<CanvasComponent>;
  let mockSampleCanvas;

  const createComponent = createComponentFactory({
    component: CanvasComponent,
    detectChanges: false
  });

  // eslint-disable-next-line no-underscore-dangle
  (window as any).__zone_symbol__FakeAsyncTestMacroTask = [
    {
      source: 'HTMLCanvasElement.toBlob',
      callbackArgs: [{ size: 200 }]
    }
  ];

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('sanity', fakeAsync(() => {
    spectator.detectChanges();

    expect(component.blobSize).toBe(0);

    spectator.tick();
    expect(component.blobSize).toBeGreaterThan(0);
  }));

  it('should check child component @ViewChild', () => {
    spectator.detectChanges();
    mockSampleCanvas = ngMocks.findInstance(ElementRef); // KEY effective technique to access @ViewChild
    // mockSampleCanvas.nativeElement // if you wanted to, you could modify the child component based on your test needs

    expect(mockSampleCanvas.nativeElement).toHaveAttribute('id', 'root1');
    expect(mockSampleCanvas.nativeElement).toBeTruthy().toMatchSnapshot();
  });
});
