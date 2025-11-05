import React from 'react';

type IconProps = {
  className?: string;
};

export const AlertIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
  </svg>
);

export const FirstAidIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.69 18.933.003.001a9.7 9.7 0 0 1-3.39-2.12.75.75 0 0 0-1.06-1.061 11.198 11.198 0 0 0 5.162 5.163.75.75 0 0 0 1.06-1.06 9.699 9.699 0 0 1-1.775-1.922ZM10 2.25a.75.75 0 0 1 .75.75v.518a9 9 0 0 1 7.232 7.232h.518a.75.75 0 0 1 0 1.5h-.518a9 9 0 0 1-7.232 7.232v.518a.75.75 0 0 1-1.5 0v-.518a9 9 0 0 1-7.232-7.232H1.5a.75.75 0 0 1 0-1.5h.518A9 9 0 0 1 9.25 3.518V3a.75.75 0 0 1 .75-.75Zm0 1.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z" clipRule="evenodd" />
    <path d="M10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
  </svg>
);

export const SpeakerOnIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M8.25 3.75a.75.75 0 0 0-1.5 0v12.5a.75.75 0 0 0 1.5 0V3.75Z" />
    <path d="M12.25 3.75a.75.75 0 0 0-1.5 0v12.5a.75.75 0 0 0 1.5 0V3.75Z" />
    <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" />
    <path d="M3.75 11.25a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" />
  </svg>
);


export const SpeakerOffIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.022 7.022a.75.75 0 0 1 1.06 0L10 8.94l1.918-1.918a.75.75 0 1 1 1.06 1.06L11.06 10l1.918 1.918a.75.75 0 1 1-1.06 1.06L10 11.06l-1.918 1.918a.75.75 0 0 1-1.06-1.06L8.94 10 7.022 8.082a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4.5h8V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V5.25A.75.75 0 0 1 10 4.5ZM5.25 5.25a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-.75-.75Zm9.5 0a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v.518a9 9 0 0 1 7.232 7.232h.518a.75.75 0 0 1 0 1.5h-.518a9 9 0 0 1-7.232 7.232v.518a.75.75 0 0 1-1.5 0v-.518a9 9 0 0 1-7.232-7.232H1.5a.75.75 0 0 1 0-1.5h.518A9 9 0 0 1 9.25 3.518V3A.75.75 0 0 1 10 2ZM8.5 5.75a.75.75 0 0 0-1.5 0v5.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V5.75Z" clipRule="evenodd" />
  </svg>
);

export const UserPlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM14 5a1 1 0 0 0-1-1h-1.5a1 1 0 0 0 0 2H13a1 1 0 0 0 1-1Z" />
        <path d="M2 10.25c0-1.306 1.13-2.373 2.585-2.624a.75.75 0 0 1 .586.202 4.908 4.908 0 0 1 3.66 2.022 4.908 4.908 0 0 1 3.66-2.022.75.75 0 0 1 .586-.202C16.87 7.877 18 8.944 18 10.25V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4.75Z" />
    </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5h-1.528a13.5 13.5 0 0 1-12.472-12.472V3.5Z" clipRule="evenodd" />
    </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 13.484 0 .75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.5 16a1.5 1.5 0 1 0 3 0h-3Z" clipRule="evenodd" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
);

export const HospitalIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm4.75 3.25a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5a.75.75 0 0 0-1.5 0v2.5h-2.5Z" clipRule="evenodd" />
  </svg>
);