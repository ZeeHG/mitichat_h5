import PreviewVideo from "./PreviewVideo.vue";

const showVideoPreview = (url: string, poster: string) => {
  const div = document.createElement("div");
  const app = createApp(PreviewVideo, {
    url,
    poster,
    onClose() {
      app.unmount();
      div.remove();
    },
  });

  app.mount(div);
  document.body.appendChild(div);
};

export default showVideoPreview;
