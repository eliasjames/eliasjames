const siteSchema = {
  pageRoutes: {
    home: {
      path: '/',
      title: 'Home',
      content: [
        {
          elementType: 'section',
          class: 'banner',
          children: [
            { 
              elementType: 'img',
              alt: 'portrait of Elias in his office with computer and guitars',
              src: '/assets/banner-office.jpg',
            },
          ],
        },
        {
          elementType: 'section',
          class: 'well',
          id: 'about',
          children: [
            {
              elementType: 'h2',
              innerHtml: '#about',
            },
          ],
        },
      ],
    },
    music: {
      content: [
        { 
          elementType: 'h2',
          innerHtml: 'music',
        },
        { 
          elementType: 'ul',
          children: [
            { 
              elementType: 'li',
              innerHtml: 'youtbue',
            },
            { 
              elementType: 'li',
              innerHtml: 'bandcamp',
            },
            { 
              elementType: 'li',
              innerHtml: 'etc',
            },
          ]
        }
      ],
    },
    writing: {
      title: 'Writing',
      content: [
        { 
          elementType: 'h2',
          innerHtml: 'writing',
        },
        { 
          elementType: 'ul',
          children: [
            { 
              elementType: 'li',
              innerHtml: 'article',
            },
            { 
              elementType: 'li',
              innerHtml: 'essay',
            },
            { 
              elementType: 'li',
              innerHtml: 'contact',
            },
          ]
        }
      ],
    },
  },
};

export default siteSchema;
