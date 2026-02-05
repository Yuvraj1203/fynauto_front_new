// icons/index.ts
import { AiTwotoneBell } from "react-icons/ai";
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiCalendar, FiEdit, FiFilter, FiHome, FiStar } from "react-icons/fi";
import {
  HiMenuAlt1,
  HiMenuAlt2,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineSearch,
} from "react-icons/hi";
import {
  IoIosArrowDown,
  IoMdCheckboxOutline,
  IoMdSwitch,
} from "react-icons/io";
import {
  IoCheckmarkDoneCircle,
  IoCloseCircle,
  IoLinkOutline,
  IoList,
  IoSettingsOutline,
  IoWarning,
} from "react-icons/io5";
import {
  LuArrowRight,
  LuBuilding2,
  LuClipboardList,
  LuCopy,
  LuDot,
  LuFileUp,
  LuFolder,
  LuGitBranch,
  LuHash,
  LuListOrdered,
  LuMessageSquare,
  LuRefreshCcw,
  LuSave,
  LuSmartphone,
  LuTableProperties,
  LuTrash2,
  LuUndo2,
} from "react-icons/lu";
import {
  MdDragIndicator,
  MdOutlineErrorOutline,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { RxText } from "react-icons/rx";
import { TbCards, TbPhoto } from "react-icons/tb";

export const ReactIcons = {
  Bell: AiTwotoneBell,
  Menu: HiMenuAlt2,
  Menu2: HiMenuAlt1,
  Search: HiOutlineSearch,
  Setting: IoSettingsOutline,
  ArrowDown: IoIosArrowDown,
  Home: FiHome,
  Dot: LuDot,
  Dashboard: MdOutlineSpaceDashboard,
  Clipboard: LuClipboardList,
  Plus: FaPlus,
  Edit: FiEdit,
  Delete: LuTrash2,
  List: IoList,
  Filter: FiFilter,
  ArrowLeft: FaArrowLeft,
  Text: RxText,
  Email: HiOutlineMail,
  Phone: HiOutlinePhone,
  Link: IoLinkOutline,
  MultiChoice: LuListOrdered,
  Checkbox: IoMdCheckboxOutline,
  Switch: IoMdSwitch,
  Hash: LuHash,
  Calendar: FiCalendar,
  Star: FiStar,
  FileUpload: LuFileUp,
  OpenEye: FaRegEye,
  CloseEye: FaRegEyeSlash,
  Save: LuSave,
  Drag: MdDragIndicator,
  Branch: LuGitBranch,
  More: RiMore2Fill,
  Undo: LuUndo2,
  Warning: IoWarning,
  Message: LuMessageSquare,
  Copy: LuCopy,
  Cards: TbCards,
  Table: LuTableProperties,
  TickCircle: IoCheckmarkDoneCircle,
  CloseCircle: IoCloseCircle,
  Refresh: LuRefreshCcw,
  Error: MdOutlineErrorOutline,
  File: LuFolder,
  Gallery: TbPhoto,
  Smartphone: LuSmartphone,
  Building: LuBuilding2,
  ArrowRight: LuArrowRight,
};
