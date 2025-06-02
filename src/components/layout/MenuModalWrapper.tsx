'use client';
import MenuModal from '@/components/MenuModal';
import { useMenuStore } from '@/store/useMenuStore';

export default function MenuModalWrapper() {
    const isMenuOpen = useMenuStore((state) => state.isMenuOpen);
    const setIsMenuOpen = useMenuStore((state) => state.setIsMenuOpen);
    
    return (
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSignOut={() => {
          // This will be handled by the HeaderWrapper component
          setIsMenuOpen(false);
        }}
      />
    );
  }