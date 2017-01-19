import { NetsosCTFPage } from './app.po';

describe('netsos-ctf App', function() {
  let page: NetsosCTFPage;

  beforeEach(() => {
    page = new NetsosCTFPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
