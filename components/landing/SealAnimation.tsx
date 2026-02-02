import Image from 'next/image';

import sealImage from '../../pictures/seal-2.png';

export default function SealAnimation() {
  return (
    <div className="relative w-full max-w-sm flex items-center justify-center mr-8 -translate-y-8">
      <Image
        src={sealImage}
        alt="Seal delivering secure mail"
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
}
