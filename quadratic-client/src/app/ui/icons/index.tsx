import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import {
  BorderAll as BorderAllIcon,
  BorderBottom as BorderBottomIcon,
  BorderColor as BorderColorIcon,
  BorderHorizontal as BorderHorizontalIcon,
  BorderInner as BorderInnerIcon,
  BorderLeft as BorderLeftIcon,
  BorderClear as BorderNoneIcon,
  BorderOuter as BorderOuterIcon,
  BorderRight as BorderRightIcon,
  BorderStyle as BorderStyleIcon,
  BorderTop as BorderTopIcon,
  BorderVertical as BorderVerticalIcon,
  ContentPasteOutlined as ClipboardIcon,
  ManageSearchOutlined as CommandPaletteIcon,
  ContentCopyOutlined as CopyIcon,
  DataObject as DataIcon,
  AttachMoney as DollarIcon,
  MoreHorizRounded as DotsHorizontalIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInNew as ExternalLinkIcon,
  ChatBubbleOutline as FeedbackIcon,
  InsertDriveFileOutlined as FileIcon,
  FormatBold as FontBoldIcon,
  FormatItalic as FontItalicIcon,
  Functions as FunctionIcon,
  AutoFixHigh as MagicWandIcon,
  Search as MagnifyingGlassIcon,
  FormatColorFill as PaintBucketIcon,
  PaletteOutlined,
  Percent as PercentIcon,
  FormatQuote as QuoteIcon,
  RedoOutlined as RedoIcon,
  ContentCutOutlined as ScissorsIcon,
  FormatAlignCenter as TextAlignCenterIcon,
  FormatAlignLeft as TextAlignLeftIcon,
  FormatAlignRight as TextAlignRightIcon,
  FormatColorText as TextColorIcon,
  FormatClear as TextNoneIcon,
  AlignVerticalBottom as TextVerticalAlignBottomIcon,
  AlignVerticalCenter as TextVerticalAlignMiddleIcon,
  AlignVerticalTop as TextVerticalAlignTopIcon,
  UndoOutlined as UndoIcon,
  WrapText as WrapTextIcon,
  ZoomInOutlined as ZoomInIcon,
  ZoomOutOutlined as ZoomOutIcon,
} from '@mui/icons-material';

export {
  BorderAllIcon,
  BorderBottomIcon,
  BorderColorIcon,
  BorderHorizontalIcon,
  BorderInnerIcon,
  BorderLeftIcon,
  BorderNoneIcon,
  BorderOuterIcon,
  BorderRightIcon,
  BorderStyleIcon,
  BorderTopIcon,
  BorderVerticalIcon,
  ClipboardIcon,
  CommandPaletteIcon,
  CopyIcon,
  DataIcon,
  DollarIcon,
  DotsHorizontalIcon,
  ExpandMoreIcon,
  ExternalLinkIcon,
  FeedbackIcon,
  FileIcon,
  FontBoldIcon,
  FontItalicIcon,
  FunctionIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  PaintBucketIcon,
  PaletteOutlined,
  PercentIcon,
  QuoteIcon,
  RedoIcon,
  ScissorsIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextColorIcon,
  TextNoneIcon,
  TextVerticalAlignBottomIcon,
  TextVerticalAlignMiddleIcon,
  TextVerticalAlignTopIcon,
  UndoIcon,
  WrapTextIcon,
  ZoomInIcon,
  ZoomOutIcon,
};

// Built on doc guidance from material UI:
// https://mui.com/material-ui/icons/
//
// Icons designed originally on 24 x 24px artboard. Figma file:
// https://www.figma.com/file/HdhrQ6vUZH4quMl7WFX6Vd/Custom-Icons?node-id=0%3A1&t=t5GeoagkcP0W7hK2-1
//
// Contents must be manually copy/pasted from exported .svg files.
// Probably could make this better in the future by using something like:
// https://github.com/gregberge/svgr

export const BorderDashed = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M4 13V11H8V13H4Z" />
    <path d="M10 13V11H14V13H10Z" />
    <path d="M16 13V11H20V13H16Z" />
  </SvgIcon>
);

export const BorderDotted = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M3 13V11H5V13H3Z" />
    <path d="M7 13V11H9V13H7Z" />
    <path d="M11 13V11H13V13H11Z" />
    <path d="M15 13V11H17V13H15Z" />
    <path d="M19 13V11H21V13H19Z" />
  </SvgIcon>
);

export const BorderDouble = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M3 11V10H21V11H3Z" />
    <path d="M3 13V12H21V13H3Z" />
  </SvgIcon>
);

export const BorderThin = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M3 13V11H21V13H3Z" />
  </SvgIcon>
);

export const BorderMedium = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M3 14V10H21V14H3Z" />
  </SvgIcon>
);

export const BorderThick = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M3 15V9H21V15H3Z" />
  </SvgIcon>
);

export const DecimalIncreaseIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="m18 22-1.4-1.4 1.575-1.6H12v-2h6.175L16.6 15.4 18 14l4 4ZM2 13v-3h3v3Zm7.5 0q-1.45 0-2.475-1.025Q6 10.95 6 9.5v-4q0-1.45 1.025-2.475Q8.05 2 9.5 2q1.45 0 2.475 1.025Q13 4.05 13 5.5v4q0 1.45-1.025 2.475Q10.95 13 9.5 13Zm9 0q-1.45 0-2.475-1.025Q15 10.95 15 9.5v-4q0-1.45 1.025-2.475Q17.05 2 18.5 2q1.45 0 2.475 1.025Q22 4.05 22 5.5v4q0 1.45-1.025 2.475Q19.95 13 18.5 13Zm-9-2q.625 0 1.062-.438Q11 10.125 11 9.5v-4q0-.625-.438-1.062Q10.125 4 9.5 4t-1.062.438Q8 4.875 8 5.5v4q0 .625.438 1.062Q8.875 11 9.5 11Zm9 0q.625 0 1.062-.438Q20 10.125 20 9.5v-4q0-.625-.438-1.062Q19.125 4 18.5 4t-1.062.438Q17 4.875 17 5.5v4q0 .625.438 1.062.437.438 1.062.438Z" />
  </SvgIcon>
);

export const DecimalDecreaseIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="m16 22-4-4 4-4 1.4 1.4-1.575 1.6H22v2h-6.175l1.575 1.6ZM2 13v-3h3v3Zm7.5 0q-1.45 0-2.475-1.025Q6 10.95 6 9.5v-4q0-1.45 1.025-2.475Q8.05 2 9.5 2q1.45 0 2.475 1.025Q13 4.05 13 5.5v4q0 1.45-1.025 2.475Q10.95 13 9.5 13Zm0-2q.625 0 1.062-.438Q11 10.125 11 9.5v-4q0-.625-.438-1.062Q10.125 4 9.5 4t-1.062.438Q8 4.875 8 5.5v4q0 .625.438 1.062Q8.875 11 9.5 11Z" />
  </SvgIcon>
);

export const Icon123 = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M4.64518 15V10.3002H3V9H6.07057V15H4.64518ZM8.34684 15V12.3252C8.34684 12.0752 8.4381 11.8626 8.6206 11.6874C8.80355 11.5126 9.04133 11.4252 9.33395 11.4252H11.8563V10.3002H8.34684V9H12.2953C12.5695 9 12.8024 9.0834 12.9942 9.2502C13.1863 9.4166 13.2824 9.6332 13.2824 9.9V11.6748C13.2824 11.9248 13.1863 12.1374 12.9942 12.3126C12.8024 12.4874 12.5695 12.5748 12.2953 12.5748H9.77223V13.6998H13.2824V15H8.34684ZM15.0645 15V13.6998H18.574V12.5748H16.1615V11.4252H18.574V10.3002H15.0645V9H19.0129C19.3055 9 19.5431 9.0834 19.7256 9.2502C19.9085 9.4166 20 9.6332 20 9.9V14.1C20 14.3668 19.9085 14.5834 19.7256 14.7498C19.5431 14.9166 19.3055 15 19.0129 15H15.0645Z" />
  </SvgIcon>
);

export const Python = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M11.8069 2.00016C10.9884 2.00397 10.2068 2.07377 9.51898 2.19548C7.49287 2.55342 7.12501 3.30264 7.12501 4.68432V6.50909H11.913V7.11735H7.12501H5.32813C3.93662 7.11735 2.71817 7.95373 2.33706 9.54481C1.89745 11.3686 1.87795 12.5066 2.33706 14.4109C2.6774 15.8284 3.49019 16.8383 4.8817 16.8383H6.52791V14.6508C6.52791 13.0705 7.89525 11.6765 9.51898 11.6765H14.3013C15.6326 11.6765 16.6953 10.5804 16.6953 9.24347V4.68432C16.6953 3.38676 15.6007 2.41203 14.3013 2.19548C13.4788 2.05856 12.6254 1.99636 11.8069 2.00016ZM9.21764 3.4678C9.7122 3.4678 10.1161 3.87827 10.1161 4.38298C10.1161 4.88589 9.7122 5.29257 9.21764 5.29257C8.7213 5.29257 8.3192 4.88589 8.3192 4.38298C8.3192 3.87827 8.7213 3.4678 9.21764 3.4678Z" />
    <path d="M17.2924 7.11736V9.24347C17.2924 10.8918 15.8949 12.2792 14.3013 12.2792H9.51898C8.20901 12.2792 7.12501 13.4003 7.12501 14.7122V19.2714C7.12501 20.5689 8.25333 21.3321 9.51898 21.7044C11.0346 22.1501 12.488 22.2306 14.3013 21.7044C15.5067 21.3554 16.6953 20.653 16.6953 19.2714V17.4466H11.913V16.8383H16.6953H19.0893C20.4808 16.8383 20.9993 15.8677 21.4833 14.4109C21.9831 12.9111 21.9619 11.4688 21.4833 9.54481C21.1394 8.15955 20.4826 7.11736 19.0893 7.11736H17.2924ZM14.6027 18.6631C15.099 18.6631 15.5011 19.0698 15.5011 19.5727C15.5011 20.0774 15.099 20.4879 14.6027 20.4879C14.1081 20.4879 13.7042 20.0774 13.7042 19.5727C13.7042 19.0698 14.1081 18.6631 14.6027 18.6631Z" />
  </SvgIcon>
);

export const Formula = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M5.98636 7.15348L5.25139 7.97705L5.32362 8.28857H7.21614C6.82969 10.505 6.54076 12.5031 5.98636 15.5825C5.32362 19.5106 4.94259 20.4756 4.71686 20.8283C4.51822 21.1774 4.23289 21.3582 3.84644 21.3582C3.42207 21.3582 2.65459 21.0252 2.24286 20.6475C2.09478 20.5472 1.91961 20.5723 1.73361 20.694C1.36161 21.0055 1.00044 21.4854 1.00044 21.915C0.97877 22.4951 1.7607 23 2.50651 23C3.16384 23 4.13177 22.5918 5.15026 21.6322C6.54256 20.3234 7.58453 18.5277 8.45495 14.6462C9.01476 12.1683 9.27841 10.557 9.67208 8.29037L12.0233 8.0791L12.5325 7.15348H9.88517C10.5696 2.88525 11.1041 2.25326 11.7614 2.25326C12.1985 2.25326 12.7077 2.58626 13.2928 3.24154C13.4662 3.47786 13.7262 3.4528 13.9248 3.29167C14.2589 3.09473 14.6706 2.58984 14.6977 2.13151C14.7176 1.62663 14.1108 1 13.0671 1C12.1208 1 10.6707 1.62663 9.45177 2.8584C8.38271 3.98096 7.8229 5.38281 7.43645 7.15348H5.98636ZM13.5095 10.0109C14.239 9.04769 14.6761 8.72721 14.9018 8.72721C15.1347 8.72721 15.3207 8.95459 15.7198 10.2329L16.4024 12.4154C15.0824 14.417 14.1163 15.5324 13.5294 15.5324C13.3343 15.5324 13.1375 15.4715 12.9984 15.3354C12.8612 15.1994 12.7095 15.0866 12.5614 15.0866C12.0775 15.0866 11.4779 15.6685 11.4671 16.39C11.4563 17.1258 11.9763 17.6522 12.6589 17.6522C13.8309 17.6522 14.8223 16.5117 16.7365 13.4878L17.2963 15.3587C17.7767 16.9665 18.3401 17.6522 19.0444 17.6522C19.9148 17.6522 21.085 16.9163 22.3617 14.9272L21.8272 14.3221C21.0597 15.2388 20.5505 15.6685 20.2489 15.6685C19.913 15.6685 19.6186 15.16 19.2304 13.9103L18.4123 11.2731C18.8963 10.5659 19.3731 9.97152 19.792 9.49707C20.2904 8.93311 20.6751 8.6932 20.9369 8.6932C21.1572 8.6932 21.3486 8.7863 21.4678 8.91699C21.6249 9.08887 21.7188 9.16943 21.9048 9.16943C22.3256 9.16943 22.9757 8.63949 22.9992 7.93766C23.0208 7.28597 22.6127 6.73096 21.9048 6.73096C20.8358 6.73096 19.8931 7.64404 18.0783 10.3188L17.7045 9.17122C17.1808 7.5599 16.834 6.73096 16.1045 6.73096C15.2557 6.73096 14.0892 7.76579 12.9479 9.40576L13.5095 10.0109Z" />
  </SvgIcon>
);

export const AI = (props: SvgIconProps) => (
  // Used AI to generate this icon. It's weird, but it works.
  <SvgIcon {...props} width="16" height="16" viewBox="0 0 16 16">
    <path d="M16 6.43424V6.42318C16 6.41073 15.994 6.39898 15.994 6.38653C15.9887 6.37478 15.9887 6.36302 15.9827 6.35058C15.9827 6.34435 15.9767 6.34435 15.9767 6.33882C15.9722 6.32792 15.9664 6.31768 15.9593 6.3084V6.30218C15.9533 6.29042 15.942 6.2842 15.93 6.27245L15.9247 6.26622C15.9127 6.26 15.9013 6.24825 15.8893 6.24202L13.4093 4.76032V1.79068C13.4093 1.77823 13.4093 1.76025 13.404 1.7485V1.73536C13.4029 1.72265 13.399 1.71037 13.3927 1.69941V1.69388C13.386 1.68212 13.3807 1.66968 13.3747 1.66415C13.3747 1.65723 13.3693 1.65723 13.3693 1.65723C13.363 1.64619 13.3551 1.63618 13.346 1.6275C13.334 1.62197 13.3287 1.60953 13.3167 1.60399C13.3113 1.60399 13.3113 1.59708 13.3053 1.59708L13.2993 1.59155L10.7033 0.0317105C10.6689 0.0109415 10.6298 0 10.59 0C10.5502 0 10.5111 0.0109415 10.4767 0.0317105L7.99667 1.51342L5.52401 0.0317105C5.4896 0.0109415 5.45049 0 5.41068 0C5.37086 0 5.33176 0.0109415 5.29734 0.0317105L2.70668 1.58533C2.70001 1.58533 2.70001 1.59224 2.70001 1.59224C2.69468 1.59224 2.69468 1.59777 2.68868 1.59777C2.67735 1.60399 2.67135 1.61575 2.66001 1.62197C2.65055 1.63032 2.64265 1.6404 2.63668 1.6517L2.63068 1.65792C2.62535 1.66968 2.61935 1.6759 2.61335 1.68835V1.69388C2.60735 1.70632 2.60735 1.71808 2.60201 1.72983V1.74228C2.60201 1.75403 2.59601 1.77201 2.59601 1.78376V4.75409L0.110681 6.24133C0.0986814 6.24825 0.087348 6.25931 0.0753481 6.26553L0.0700147 6.27176L0.0406814 6.30149V6.3084C0.0346814 6.32015 0.0293481 6.32569 0.0233481 6.33813C0.0233481 6.34366 0.0173481 6.34366 0.0173481 6.34989C0.0110365 6.36085 0.00716453 6.37313 0.00601479 6.38584C1.47944e-05 6.39828 1.47944e-05 6.41004 1.47944e-05 6.42318V9.54907C-0.000438797 9.59025 0.00954509 9.63083 0.028967 9.66675C0.0483889 9.70267 0.0765673 9.73266 0.110681 9.75373L2.59068 11.2354V14.2051C2.59016 14.2462 2.60004 14.2867 2.61934 14.3226C2.63864 14.3585 2.66669 14.3886 2.70068 14.4097L5.29068 15.964C5.29668 15.9696 5.30268 15.9696 5.30801 15.9758C5.30801 15.9758 5.31401 15.9758 5.31401 15.982C5.32001 15.982 5.32534 15.9876 5.33134 15.9876C5.33734 15.9876 5.33734 15.9876 5.34334 15.9945C5.34868 15.9945 5.35468 15.9945 5.36068 16H5.40134C5.43107 15.9998 5.46049 15.9937 5.48801 15.982C5.50001 15.9758 5.50534 15.9758 5.51734 15.9696L7.99734 14.4879L10.4773 15.9696C10.4887 15.9758 10.4947 15.982 10.506 15.982C10.5335 15.9937 10.5629 15.9998 10.5927 16H10.634C10.6393 16 10.6453 16 10.6513 15.9938C10.6567 15.9938 10.6567 15.9938 10.6627 15.9876C10.6687 15.9876 10.6747 15.982 10.68 15.982C10.686 15.982 10.686 15.982 10.686 15.9758C10.692 15.9758 10.6973 15.9696 10.7033 15.964L13.2933 14.4097C13.3275 14.3887 13.3556 14.3587 13.3751 14.3228C13.3945 14.2868 13.4045 14.2463 13.404 14.2051V11.2354L15.884 9.75373C15.918 9.73258 15.946 9.70254 15.9653 9.66663C15.9846 9.63072 15.9945 9.59019 15.994 9.54907V6.44668C16 6.43977 16 6.43424 16 6.43424ZM8.11334 13.9942C8.11334 13.9942 8.10734 13.9942 8.10734 13.988C8.10134 13.9824 8.09601 13.9824 8.08401 13.9762C8.07867 13.9762 8.07267 13.97 8.06667 13.97C8.06067 13.97 8.05534 13.9638 8.04334 13.9638C8.03801 13.9638 8.02601 13.9582 8.02001 13.9582H7.97401C7.96801 13.9582 7.95667 13.9582 7.95067 13.9638C7.94467 13.9638 7.93934 13.9638 7.92734 13.9707C7.92134 13.9707 7.91601 13.9762 7.91001 13.9762C7.90401 13.9824 7.89867 13.9824 7.88667 13.988C7.88667 13.988 7.88067 13.988 7.88067 13.9942L5.63401 15.3432V12.7835L7.99734 11.3682L10.3607 12.7835V15.3432L8.11334 13.9942ZM2.93335 5.09081C2.94468 5.07906 2.95001 5.07284 2.95601 5.07284C2.96201 5.06731 2.96801 5.06731 2.97335 5.06108L2.99068 5.04311C2.99735 5.03688 3.00268 5.03066 3.00268 5.02513C3.00868 5.01821 3.00868 5.01268 3.01401 5.00715C3.02001 5.00024 3.02001 4.99471 3.02601 4.98848C3.03135 4.98295 3.03135 4.97673 3.03135 4.96498C3.03135 4.95806 3.03801 4.95253 3.03801 4.94078C3.03801 4.93455 3.03801 4.92833 3.04335 4.91658V2.19377L5.18001 3.47774V6.3084L2.81668 7.72304L0.680014 6.44046L2.93335 5.09081ZM7.99734 2.06171L10.3607 3.47704V6.03598L8.10734 4.68703C8.10734 4.68703 8.10134 4.68703 8.10134 4.6808C8.09601 4.67458 8.09001 4.67458 8.07867 4.66905C8.07201 4.66905 8.06667 4.66283 8.06067 4.66283C8.05534 4.66283 8.04934 4.6566 8.03801 4.6566C8.03134 4.6566 8.02601 4.65107 8.01467 4.65107H7.96801C7.96201 4.65107 7.95067 4.65107 7.94467 4.6566C7.93934 4.6566 7.93334 4.6566 7.92134 4.66283C7.91601 4.66283 7.91001 4.66905 7.90401 4.66905C7.89867 4.67458 7.88667 4.67458 7.88067 4.6808C7.88067 4.6808 7.87534 4.6808 7.87534 4.68703L5.63334 6.03598V3.47774L7.99734 2.06171ZM7.99734 10.8254L5.63334 9.4101V6.57874L7.99734 5.16341L10.3607 6.57874V9.4101L7.99734 10.8254ZM3.04335 8.12683L5.18068 6.84356V9.57258C5.18068 9.57811 5.18068 9.58434 5.18601 9.59678C5.18601 9.60231 5.19201 9.60854 5.19201 9.62029C5.19201 9.6272 5.19801 9.63274 5.19801 9.64449C5.20334 9.65071 5.20334 9.65694 5.20934 9.66247C5.21534 9.66938 5.21534 9.67491 5.22134 9.68114C5.22668 9.68667 5.23268 9.69289 5.23268 9.69911L5.25001 9.71709C5.25601 9.72331 5.26201 9.72884 5.26734 9.72884C5.27334 9.73507 5.27934 9.74129 5.28468 9.74129L5.29134 9.74682L7.54467 11.0965L5.40668 12.379L3.04335 10.9637V8.12683ZM10.5933 12.379L8.45601 11.0965L10.7093 9.74682L10.7153 9.74129C10.7207 9.73507 10.7267 9.72884 10.7327 9.72884C10.738 9.72331 10.744 9.72331 10.75 9.71709L10.7673 9.69911C10.7733 9.69289 10.7787 9.68667 10.7787 9.68114C10.7853 9.67422 10.7853 9.66869 10.7907 9.66247C10.7967 9.65694 10.7967 9.65071 10.802 9.64449C10.808 9.63896 10.808 9.63274 10.808 9.62029C10.808 9.61476 10.814 9.60854 10.814 9.59678C10.814 9.58987 10.814 9.58434 10.8193 9.57258V6.84356L12.9567 8.12683V10.9575L10.5933 12.379ZM13.1833 7.72304L10.8193 6.30771V3.47774L12.9567 2.19446V4.9228C12.9567 4.92833 12.9567 4.93455 12.9627 4.94631C12.9627 4.95322 12.9687 4.95875 12.9687 4.97051C12.9687 4.97673 12.974 4.98295 12.974 4.99471C12.9807 5.00093 12.9807 5.00715 12.986 5.01268C12.9913 5.01891 12.9913 5.02513 12.9973 5.03066C13.0033 5.03757 13.0093 5.04311 13.0093 5.04864C13.0147 5.05555 13.0207 5.06108 13.0267 5.0673C13.032 5.07284 13.038 5.07906 13.044 5.07906C13.05 5.08528 13.0553 5.09081 13.0613 5.09081L13.0673 5.09773L15.3207 6.44599L13.1833 7.72304ZM10.5933 0.507406L12.73 1.79068L10.5933 3.07326L8.45601 1.79068L10.5933 0.507406ZM5.40668 0.507406L7.54401 1.79068L5.40668 3.06703L3.27001 1.79068L5.40668 0.507406ZM0.453348 6.84978L2.59001 8.13305V10.6927L0.453348 9.4101V6.84978ZM5.18001 15.3425L3.04335 14.0599V11.4996L5.18068 12.7828L5.18001 15.3425ZM12.9567 14.0661L10.8193 15.3487V12.7891L12.9567 11.5058V14.0661ZM15.5473 9.4101L13.41 10.6927V8.13305L15.5473 6.84978V9.4101Z" />
  </SvgIcon>
);

export const JavaScript = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M2 2H22V22H2V2ZM16.8855 18.2177C15.9712 18.2177 15.4543 17.7011 15.0569 16.9982L13.5506 17.9463C14.0948 19.1112 15.2069 20 16.9284 20C18.689 20 20 19.0095 20 17.2014C20 15.5243 19.1108 14.7783 17.5358 14.0466L17.0724 13.8315C16.2771 13.4584 15.9327 13.2145 15.9327 12.612C15.9327 12.1246 16.2768 11.7514 16.8197 11.7514C17.352 11.7514 17.6949 11.9946 18.0127 12.612L19.4561 11.6079C18.8456 10.4444 17.9983 10 16.8197 10C15.1643 10 14.1051 11.1466 14.1051 12.6527C14.1051 14.2878 14.9937 15.0612 16.3313 15.6786L16.7947 15.894C17.6401 16.2947 18.1442 16.5386 18.1442 17.2272C18.1442 17.8018 17.6536 18.2177 16.8855 18.2177ZM9.70182 18.2052C9.06496 18.2052 8.80007 17.7319 8.50888 17.1722L7 18.1619C7.4371 19.1642 8.29659 19.9963 9.78073 19.9963C11.4233 19.9963 12.5486 19.0498 12.5486 16.9704V10.1147H10.695V16.9432C10.695 17.947 10.3108 18.2052 9.70182 18.2052Z" />
  </SvgIcon>
);

export const Sql = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M12 10.5C9.5 10.5 7.375 10.1083 5.625 9.325C3.875 8.54167 3 7.6 3 6.5C3 5.4 3.875 4.45833 5.625 3.675C7.375 2.89167 9.5 2.5 12 2.5C14.5 2.5 16.625 2.89167 18.375 3.675C20.125 4.45833 21 5.4 21 6.5C21 7.6 20.125 8.54167 18.375 9.325C16.625 10.1083 14.5 10.5 12 10.5ZM12 15.5C9.5 15.5 7.375 15.1083 5.625 14.325C3.875 13.5417 3 12.6 3 11.5V9C3 9.73333 3.34167 10.3543 4.025 10.863C4.70833 11.371 5.525 11.7833 6.475 12.1C7.425 12.4167 8.41267 12.6457 9.438 12.787C10.4627 12.929 11.3167 13 12 13C12.6833 13 13.5373 12.929 14.562 12.787C15.5873 12.6457 16.575 12.4167 17.525 12.1C18.475 11.7833 19.2917 11.371 19.975 10.863C20.6583 10.3543 21 9.73333 21 9V11.5C21 12.6 20.125 13.5417 18.375 14.325C16.625 15.1083 14.5 15.5 12 15.5ZM12 20.5C9.5 20.5 7.375 20.1083 5.625 19.325C3.875 18.5417 3 17.6 3 16.5V14C3 14.7333 3.34167 15.3543 4.025 15.863C4.70833 16.371 5.525 16.7833 6.475 17.1C7.425 17.4167 8.41267 17.646 9.438 17.788C10.4627 17.9293 11.3167 18 12 18C12.6833 18 13.5373 17.9293 14.562 17.788C15.5873 17.646 16.575 17.4167 17.525 17.1C18.475 16.7833 19.2917 16.371 19.975 15.863C20.6583 15.3543 21 14.7333 21 14V16.5C21 17.6 20.125 18.5417 18.375 19.325C16.625 20.1083 14.5 20.5 12 20.5Z" />
  </SvgIcon>
);

export const SaveFileOutlined = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.588 21.413C4.97933 21.8043 5.45 22 6 22H18C18.55 22 19.021 21.8043 19.413 21.413C19.8043 21.021 20 20.55 20 20V8L14 2H6C5.45 2 4.97933 2.19567 4.588 2.587C4.196 2.979 4 3.45 4 4V20C4 20.55 4.196 21.021 4.588 21.413ZM13 4V9H18V20H6V4H13ZM13 11H11L11 15.175L9.4 13.575L8 15L12 19L16 15L14.575 13.6L13 15.175L13 11Z"
    />
  </SvgIcon>
);
export const ShareFileOutlined = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M4.588 21.413C4.97933 21.8043 5.45 22 6 22H9V20H6V9V4H13V9H18V11H20V8L14 2H6C5.45 2 4.97933 2.19567 4.588 2.587C4.196 2.979 4 3.45 4 4V20C4 20.55 4.196 21.021 4.588 21.413Z" />
    <path d="M16 12C12.688 12 10 14.688 10 18C10 21.312 12.688 24 16 24C19.312 24 22 21.312 22 18C22 14.688 19.312 12 16 12ZM11.2 18C11.2 17.634 11.248 17.274 11.326 16.932L14.194 19.8V20.4C14.194 21.06 14.734 21.6 15.394 21.6V22.758C13.036 22.458 11.2 20.442 11.2 18ZM19.534 21.24C19.378 20.754 18.934 20.4 18.394 20.4H17.794V18.6C17.794 18.27 17.524 18 17.194 18H13.594V16.8H14.794C15.124 16.8 15.394 16.53 15.394 16.2V15H16.594C17.254 15 17.794 14.46 17.794 13.8V13.554C19.552 14.262 20.8 15.99 20.8 18C20.8 19.248 20.314 20.388 19.534 21.24Z" />
  </SvgIcon>
);

export const CopyAsPNG = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
    <path d="M9 15V19H18L14.25 14L11.25 18L9 15Z" />
    <path d="M15.425 11.575C15.7083 11.8583 16.0667 12 16.5 12C16.9333 12 17.2917 11.8583 17.575 11.575C17.8583 11.2917 18 10.9333 18 10.5C18 10.0667 17.8583 9.70833 17.575 9.425C17.2917 9.14167 16.9333 9 16.5 9C16.0667 9 15.7083 9.14167 15.425 9.425C15.1417 9.70833 15 10.0667 15 10.5C15 10.9333 15.1417 11.2917 15.425 11.575Z" />
  </SvgIcon>
);

export const FileDeleteIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.588 21.413C4.97933 21.8043 5.45 22 6 22H12V20H6V4H13V9H18V12H20V8L14 2H6C5.45 2 4.97933 2.19567 4.588 2.587C4.196 2.979 4 3.45 4 4V20C4 20.55 4.196 21.021 4.588 21.413Z"
    />
    <rect x="15" y="18" width="8" height="2" />
  </SvgIcon>
);

export const FileDowndloadIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.588 21.413C4.97933 21.8043 5.45 22 6 22H12V20H6V4H13V9H18V12H20V8L14 2H6C5.45 2 4.97933 2.19567 4.588 2.587C4.196 2.979 4 3.45 4 4V20C4 20.55 4.196 21.021 4.588 21.413Z"
    />
    <path d="M18 15L20 15L20 19.175L21.575 17.6L23 19L19 23L15 19L16.4 17.575L18 19.175L18 15Z" />
  </SvgIcon>
);

export const FileDuplicateIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.588 21.413C4.97933 21.8043 5.45 22 6 22H12V20H6V4H13V9H18V12H20V8L14 2H6C5.45 2 4.97933 2.19567 4.588 2.587C4.196 2.979 4 3.45 4 4V20C4 20.55 4.196 21.021 4.588 21.413Z"
    />
    <rect x="15" y="18" width="8" height="2" />
    <rect x="20" y="15" width="8" height="2" transform="rotate(90 20 15)" />
  </SvgIcon>
);

export const SheetIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path d="M2 6C2 5.45 2.19567 4.97933 2.587 4.588C2.979 4.196 3.45 4 4 4L20 4C20.55 4 21.021 4.196 21.413 4.588C21.8043 4.97933 22 5.45 22 6C22 6 22 17.5 22 18C22 18.5 21.8035 19.0297 21.4202 19.413C21.0368 19.7963 20.5 20 20 20C19.5 20 4 20 4 20C3.45 20 2.979 19.8043 2.587 19.413C2.19567 19.021 2 18.55 2 18L2 6ZM20 18L20 13L20 6L4 6L4 18L15 18L20 18Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7 18L7 6L9 6L9 18L7 18Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20 11H4V9H20V11Z" />
  </SvgIcon>
);

export const SheetDuplicateIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.587 4.588C2.19567 4.97933 2 5.45 2 6V18C2 18.55 2.19567 19.021 2.587 19.413C2.979 19.8043 3.45 20 4 20H12V18L4 18L4 6L20 6V12H22V6C22 5.45 21.8043 4.97933 21.413 4.588C21.021 4.196 20.55 4 20 4H4C3.45 4 2.979 4.196 2.587 4.588Z"
    />
    <rect x="15" y="18" width="8" height="2" />
    <rect x="20" y="15" width="8" height="2" transform="rotate(90 20 15)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7 18L7 6L9 6L9 18L7 18Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20 11H4V9H20V11Z" />
  </SvgIcon>
);

export const SheetDeleteIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.587 4.588C2.19567 4.97933 2 5.45 2 6V18C2 18.55 2.19567 19.021 2.587 19.413C2.979 19.8043 3.45 20 4 20H12V18L4 18L4 6L20 6V12H22V6C22 5.45 21.8043 4.97933 21.413 4.588C21.021 4.196 20.55 4 20 4H4C3.45 4 2.979 4.196 2.587 4.588Z"
    />
    <rect x="15" y="16" width="8" height="2" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7 18L7 6L9 6L9 18L7 18Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20 11H4V9H20V11Z" />
  </SvgIcon>
);

export const SheetGoToIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.587 4.588C2.19567 4.97933 2 5.45 2 6V18C2 18.55 2.19567 19.021 2.587 19.413C2.979 19.8043 3.45 20 4 20H12V18L4 18L4 6L20 6V12H22V6C22 5.45 21.8043 4.97933 21.413 4.588C21.021 4.196 20.55 4 20 4H4C3.45 4 2.979 4.196 2.587 4.588Z"
    />
    <path fillRule="evenodd" clipRule="evenodd" d="M7 18L7 6L9 6L9 18L7 18Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20 11H4V9H20V11Z" />
    <path d="M15 20L15 18L19.175 18L17.6 16.425L19 15L23 19L19 23L17.575 21.6L19.175 20L15 20Z" />
  </SvgIcon>
);

export const TextOverflowIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="white" fill-opacity="0.01" />
      <path d="M8 10V38" stroke="black" stroke-width="4" stroke-linecap="round" />
      <path d="M24 4V16" stroke="black" stroke-width="4" stroke-linecap="round" />
      <path d="M16 24H42" stroke="black" stroke-width="4" stroke-linecap="round" />
      <path
        d="M37.0561 19.0113L42.0929 24.0255L37.0561 29.123"
        stroke="black"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M24 32V44" stroke="black" stroke-width="4" stroke-linecap="round" />
    </svg>
  </SvgIcon>
);

export const TextClipIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="white" fill-opacity="0.01" />
      <path d="M8 8V40" stroke="black" stroke-width="4" stroke-linecap="round" />
      <path d="M40 8V40" stroke="black" stroke-width="4" stroke-linecap="round" />
      <path d="M20.0522 24.0083H40.0002" stroke="black" stroke-width="4" stroke-linecap="round" />
    </svg>
  </SvgIcon>
);
