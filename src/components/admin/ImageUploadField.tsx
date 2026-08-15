import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/integrations/firebase/storage";

export function ImageUploadField({
  value,
  onChange,
  folder,
  previewClassName = "h-14 w-14 rounded-lg object-cover",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  previewClassName?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed. Check Firebase Storage rules are published.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3">
      {value ? (
        <img src={value} alt="preview" className={previewClassName} />
      ) : (
        <div className={`${previewClassName} grid place-items-center bg-muted text-muted-foreground`}>
          <Upload className="h-4 w-4" />
        </div>
      )}
      <div className="flex-1 space-y-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL"
          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent/60 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Uploading…" : "Upload a file"}
          </button>
          <span className="text-[11px] text-muted-foreground">or paste a URL above</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
