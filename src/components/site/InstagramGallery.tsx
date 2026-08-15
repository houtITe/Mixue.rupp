const shots = [
  "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523371683702-1236eab88d55?auto=format&fit=crop&w=600&q=80",
];

export function InstagramGallery() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {shots.map((src, i) => (
        <a
          key={src}
          href="#"
          className="relative aspect-square overflow-hidden rounded-2xl group"
          aria-label={`Instagram photo ${i + 1}`}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
            <span className="text-primary-foreground font-semibold">@mixuerupp</span>
          </div>
        </a>
      ))}
    </div>
  );
}
