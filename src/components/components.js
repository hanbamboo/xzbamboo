import SvgIcon from '@/components/Svg/index.vue';
import Calendar from '@/components/Calendar/calendar.vue';
import Comment from '@/components/Comment/comment.vue';
import Emoji from '@/components/Emoji/emoji.vue';
import Memory from '@/components/Memory/memory.vue';
import Svg from '@/components/Svg/index.vue';
import ToolBar from '@/components/User/ToolBar/toolbar.vue';
import ImageUpload from '@/components/ImageUpload/imageUpload.vue';

const components = {
    SvgIcon,
    Calendar,
    Comment,
    Emoji,
    Memory,
    Svg,
    ToolBar,
    ImageUpload,
};

export default {
    install(app) {
        Object.keys(components).forEach((key) => {
            app.component(key, components[key]);
        });
    }
};