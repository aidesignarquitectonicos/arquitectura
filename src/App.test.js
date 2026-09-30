import { pickRandomVideo } from './Presentation/model/HomeModel';

test('pickRandomVideo returns a usable video URL from object-shaped project data', () => {
  const projects = [
    {
      videos: [
        { url: 'https://example.com/project-video.mp4', type: 'video' },
        { url: 'https://example.com/second-video.mp4', type: 'video' },
      ],
    },
  ];

  const result = pickRandomVideo(projects);

  expect(typeof result).toBe('string');
  expect(result).toMatch(/\.mp4$/i);
});
