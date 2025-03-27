import { useEffect } from 'react';

function usePagetitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default usePagetitle;
