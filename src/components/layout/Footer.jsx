export function Footer() {
  return (
    <footer className='border-t py-6'>
      <div className='flex w-full flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row md:px-12 lg:px-16'>
        <p className='text-muted-foreground text-center text-sm leading-loose text-balance md:text-left'>
          Built by LumosTV. The source code is available on GitHub.
        </p>
      </div>
    </footer>
  );
}
