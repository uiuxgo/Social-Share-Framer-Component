import * as React from "react"
import { addPropertyControls, ControlType, Color } from "framer"

const BRAND_COLORS = {
    facebook: "#0866FF",
    twitter: "#000",
    linkedIn: "#0A66C2",
    reddit: "#FF4500",
    pinterest: "#BD081C",
    whatsApp: "#25D366",
    telegram: "#24A1DE",
    email: "#000",
    copyUrl: "#000"
}

export const PLATFORM_NAMES = [
    "Facebook",
    "Twitter / X",
    "LinkedIn",
    "Reddit",
    "Pinterest",
    "WhatsApp",
    "Telegram",
    "Email",
    "Copy URL"
]

export default function SocialShare(props) {
    const { type, colors, iconSize, border, hover } = props
    const [shareUrl, setShareUrl] = React.useState(props.shareLink === "url" ? props.shareUrl : "")
    const [isHovered, setIsHovered] = React.useState(false)

    const defaultBackgroundColor =
        colors.fillColorType === "custom"
            ? colors.fillColor
            : Color.toString(Color.alpha(Color(BRAND_COLORS[type]), colors.fillOpacity))

    const defaultIconColor =
        colors.iconColorType === "custom" ? colors.iconColor : Color.toString(Color.alpha(Color(BRAND_COLORS[type]), 1))

    const defaultBorderColor =
        border?.colorType === "custom" ? border.color : Color.toString(Color.alpha(Color(BRAND_COLORS[type]), 1))

    let currentBackgroundColor = defaultBackgroundColor
    let currentIconColor = defaultIconColor
    let currentBorderColor = defaultBorderColor
    let currentScale = 1
    let currentOpacity = 1

    if (isHovered && hover) {
        if (hover.scale !== undefined) currentScale = hover.scale
        if (hover.opacity !== undefined) currentOpacity = hover.opacity
        if (hover.fillColorType === "custom") {
            currentBackgroundColor = hover.fillColor
        } else {
            currentBackgroundColor = Color.toString(
                Color.alpha(Color(BRAND_COLORS[type]), hover.fillOpacity ?? 1)
            )
        }

        if (hover.iconColorType === "custom") {
            currentIconColor = hover.iconColor
        } else {
            currentIconColor = Color.toString(
                Color.alpha(Color(BRAND_COLORS[type]), hover.iconOpacity ?? 1)
            )
        }

        if (border) {
            if (hover.borderColorType === "custom") {
                currentBorderColor = hover.borderColor
            } else {
                currentBorderColor = Color.toString(
                    Color.alpha(Color(BRAND_COLORS[type]), hover.borderOpacity ?? 1)
                )
            }
        }
    }

    React.useEffect(() => {
        if (props.shareLink === "currentPage") {
            setShareUrl(window.location.href)
        }
    }, [props.shareLink, props.shareUrl])

    const encodedUrl = encodeURIComponent(shareUrl)

    const borderRadius = props.radiusIsMixed
        ? `${props.radiusTopLeft}px ${props.radiusTopRight}px ${props.radiusBottomRight}px ${props.radiusBottomLeft}px`
        : `${props.radius}px`

    const padding = props.paddingIsMixed
        ? `${props.paddingTop}px ${props.paddingRight}px ${props.paddingBottom}px ${props.paddingLeft}px`
        : `${props.padding}px`

    let linkUrl = ""
    switch (type) {
        case "facebook":
            linkUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
            break
        case "twitter":
            linkUrl = `https://twitter.com/share?url=${encodedUrl}`
            break
        case "linkedIn":
            linkUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
            break
        case "reddit":
            linkUrl = `https://www.reddit.com/submit?url=${encodedUrl}`
            break
        case "pinterest":
            linkUrl = `https://pinterest.com/pin/create/link/?url=${encodedUrl}`
            break
        case "whatsApp":
            linkUrl = `https://wa.me/?text=${encodedUrl}`
            break
        case "telegram":
            linkUrl = `https://t.me/share/url?url=${encodedUrl}`
            break
        case "email":
            linkUrl = `mailto:?subject=Check this out&body=${encodedUrl}`
            break
    }

    const copyToClipboard = () => {
        const message = `${props.copyPrefix || ""} ${shareUrl} ${props.copySuffix || ""}`.trim()
        navigator.clipboard.writeText(message)
            .then(() => alert("URL copied to clipboard!"))
            .catch(() => alert("Failed to copy URL"))
    }

    return (
        <a
            href={linkUrl.length ? linkUrl : undefined}
            target={props.newTab ? "_blank" : "_self"}
            rel={props.newTab ? "noopener noreferrer" : undefined}
            aria-label={PLATFORM_NAMES[type]}
            onClick={type === "copyUrl" ? copyToClipboard : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                borderRadius: borderRadius,
                padding: padding,
                cursor: "pointer",
                transition: "transform 0.25s ease-in-out, opacity 0.25s ease-in-out",
                transform: `scale(${currentScale})`,
                opacity: currentOpacity,
                ...props.style,
                overflow: "visible",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: currentBackgroundColor,
                    borderWidth: border
                        ? border.widthIsMixed
                            ? `${border.widthTop}px ${border.widthRight}px ${border.widthBottom}px ${border.widthLeft}px`
                            : `${border.width}px`
                        : 0,
                    borderStyle: border?.style || "solid",
                    borderColor: border ? currentBorderColor : "transparent",
                    borderRadius: borderRadius,
                    pointerEvents: "none",
                    backgroundClip: "padding-box",
                    transition: "background-color 0.25s ease-in-out, border-color 0.25s ease-in-out, border-width 0.25s ease-in-out",
                }}
            />
            <SocialIcon
                type={type}
                size={iconSize}
                color={currentIconColor}
                customIcon={props.customIcon}
                style={{ overflow: "visible", transition: "color 0.25s ease-in-out", position: "relative" }}
            />
        </a>
    )
}

SocialShare.displayName = "Social Share"

function SocialIcon(props) {
    const { size, color, customIcon } = props

    if (customIcon) {
        if (customIcon.type === "svg" && customIcon.svg) {
            return (
                <>
                    <div
                        className="social-share-icon"
                        style={{
                            width: size,
                            height: size,
                            opacity: customIcon.opacity,
                            color: color,
                            pointerEvents: "none",
                            transition: "all 0.25s ease-in-out",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: customIcon.svg
                                .replace(/width="(\d+)"/, `width="${size}"`)
                                .replace(/height="(\d+)"/, `height="${size}"`),
                        }}
                    />
                    <style>{`.social-share-icon svg { display: block; }`}</style>
                </>
            )
        } else if (customIcon.type === "image" && customIcon.image) {
            return (
                <img
                    src={customIcon.image.src}
                    alt={customIcon.image.alt || ""}
                    style={{
                        display: "block",
                        width: size,
                        height: size,
                        opacity: customIcon.opacity,
                        color: color,
                        objectFit: customIcon.sizing as any,
                        objectPosition: "center",
                        pointerEvents: "none",
                        transition: "all 0.25s ease-in-out",
                    }}
                />
            )
        }
    }

    let contents
    let fill = true
    let stroke = false

    switch (props.type) {
        case "facebook":
            contents = (
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            )
            break
        case "twitter":
            contents = (
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            )
            break
        case "linkedIn":
            contents = (
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            )
            break
        case "reddit":
            contents = (
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            )
            break
        case "pinterest":
            contents = (
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
            )
            break
        case "whatsApp":
            contents = (
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            )
            break
        case "telegram":
            contents = (
                <path d="M23.9333 3.70355C24.0222 3.43457 24.0222 3.16559 23.9333 2.80694C23.9333 2.62762 23.7554 2.35864 23.6664 2.26898C23.3996 2 22.9548 2 22.7769 2C21.9763 2 20.642 2.4483 14.5042 5.04846C12.3693 5.94506 8.09958 7.73827 1.69493 10.6074C0.627489 11.0557 0.0937686 11.4144 0.00481514 11.8627C-0.0841383 12.5799 1.07226 12.8489 2.40656 13.2972C3.56295 13.6559 5.07516 14.1042 5.87574 14.1042C6.58737 14.1042 7.38795 13.8352 8.27748 13.2076C14.2374 9.08318 17.3507 7.02099 17.5286 7.02099C17.7065 7.02099 17.8845 6.93133 17.9734 7.02099C18.1513 7.20031 18.1513 7.37963 18.0624 7.46929C17.9734 7.9176 12.3693 13.1179 12.0135 13.4765C10.7682 14.7318 9.34492 15.5387 11.5688 16.9733C13.4368 18.2286 14.5042 19.0355 16.4612 20.2908C17.7065 21.0977 18.685 22.084 19.9304 21.9943C20.5531 21.9046 21.1757 21.3667 21.4426 19.6631C22.2432 15.8077 23.6664 7.20031 23.9333 3.70355Z" />
            )
            break
        case "email":
            contents = (
                <>
                    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                    <path d="M3 7l9 6l9 -6" />
                </>
            )
            fill = false
            stroke = true
            break
        case "copyUrl":
            contents = (
                <>
                    <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                    <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                </>
            )
            fill = false
            stroke = true
            break
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            color={color}
            strokeWidth={stroke ? "2" : undefined}
            stroke={stroke ? "currentColor" : undefined}
            fill={fill ? "currentColor" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "block", overflow: "visible", ...(props.style || {}) }}
        >
            {contents}
        </svg>
    )
}

addPropertyControls(SocialShare, {
    shareLink: {
        type: ControlType.Enum,
        defaultValue: "currentPage",
        options: ["currentPage", "url"],
        optionTitles: ["Current Page", "Custom URL"],
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
    },
    shareUrl: {
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://example.com",
        title: "URL",
        hidden: (props) => props.shareLink !== "url",
    },
    type: {
        type: ControlType.Enum,
        defaultValue: "facebook",
        options: [
            "facebook",
            "twitter",
            "linkedIn",
            "reddit",
            "pinterest",
            "whatsApp",
            "telegram",
            "email",
            "copyUrl",
        ],
        optionTitles: PLATFORM_NAMES,
        title: "Platform",
    },
    newTab: {
        type: ControlType.Boolean,
        defaultValue: true,
    },
    copyPrefix: {
        type: ControlType.String,
        title: "Prefix",
        placeholder: "Check this out:",
        hidden: (props) => props.type !== "copyUrl",
    },
    copySuffix: {
        type: ControlType.String,
        title: "Suffix",
        placeholder: "#AwesomeLink",
        hidden: (props) => props.type !== "copyUrl",
    },
    colors: {
        type: ControlType.Object,
        buttonTitle: "Icon & Fill",
        controls: {
            iconColorType: {
                type: ControlType.Enum,
                defaultValue: "custom",
                options: ["brand", "custom"],
                optionTitles: ["Brand", "Custom"],
                displaySegmentedControl: true,
                title: "Icon Color",
            },
            iconColor: {
                type: ControlType.Color,
                defaultValue: "#FFF",
                hidden: (props) => props.iconColorType !== "custom",
                title: " ",
            },
            fillColorType: {
                type: ControlType.Enum,
                defaultValue: "brand",
                options: ["brand", "custom"],
                optionTitles: ["Brand", "Custom"],
                displaySegmentedControl: true,
                title: "Fill",
            },
            fillColor: {
                type: ControlType.Color,
                defaultValue: "#000",
                hidden: (props) => props.fillColorType !== "custom",
                title: " ",
            },
            fillOpacity: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.01,
                hidden: (props) => props.fillColorType !== "brand",
            },
        },
    },
    iconSize: {
        type: ControlType.Number,
        defaultValue: 24,
        min: 1,
        step: 1,
    },
    radius: {
        type: ControlType.FusedNumber,
        defaultValue: 8,
        toggleKey: "radiusIsMixed",
        toggleTitles: ["All", "Individual"],
        valueKeys: [
            "radiusTopLeft",
            "radiusTopRight",
            "radiusBottomRight",
            "radiusBottomLeft",
        ],
        valueLabels: ["TL", "TR", "BR", "BL"],
        min: 0,
    },
    padding: {
        type: ControlType.FusedNumber,
        defaultValue: 12,
        toggleKey: "paddingIsMixed",
        toggleTitles: ["All", "Individual"],
        valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
    },
    border: {
        type: ControlType.Object,
        optional: true,
        controls: {
            colorType: {
                type: ControlType.Enum,
                defaultValue: "brand",
                options: ["brand", "custom"],
                optionTitles: ["Brand", "Custom"],
                displaySegmentedControl: true,
                title: "Color",
            },
            color: {
                type: ControlType.Color,
                defaultValue: "#FFF",
                title: " ",
                hidden: (props) => props.colorType !== "custom",
            },
            width: {
                type: ControlType.FusedNumber,
                defaultValue: 1,
                toggleKey: "widthIsMixed",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["widthTop", "widthRight", "widthBottom", "widthLeft"],
                valueLabels: ["T", "R", "B", "L"],
                min: 0,
            },
            style: {
                type: ControlType.Enum,
                defaultValue: "solid",
                options: ["solid", "dashed", "dotted", "double"],
                optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
            },
        },
    },
    customIcon: {
        type: ControlType.Object,
        optional: true,
        buttonTitle: "Icon",
        controls: {
            type: {
                type: ControlType.Enum,
                defaultValue: "svg",
                options: ["svg", "image"],
                optionTitles: ["SVG", "Image"],
                displaySegmentedControl: true,
            },
            svg: {
                type: ControlType.String,
                placeholder: "<svg></svg>",
                displayTextArea: true,
                title: "SVG",
                hidden: (props) => props.type !== "svg",
            },
            image: {
                type: ControlType.ResponsiveImage,
                hidden: (props) => props.type !== "image",
            },
            sizing: {
                type: ControlType.Enum,
                defaultValue: "cover",
                options: ["cover", "contain", "fill"],
                optionTitles: ["Fill", "Fit", "Stretch"],
                hidden: (props) => props.type !== "image",
            },
            opacity: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.01,
            },
        },
    },
    hover: {
        type: ControlType.Object,
        optional: true,
        buttonTitle: "Hover Effect",
        controls: {
            scale: {
                type: ControlType.Number,
                defaultValue: 1.1,
                min: 0,
                max: 2,
                step: 0.05,
            },
            opacity: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.05,
            },
            fillColorType: {
                type: ControlType.Enum,
                defaultValue: "brand",
                options: ["brand", "custom"],
                optionTitles: ["Brand", "Custom"],
                displaySegmentedControl: true,
                title: "Fill",
            },
            fillColor: {
                type: ControlType.Color,
                defaultValue: "#000",
                hidden: (props) => props.fillColorType !== "custom",
                title: " ",
            },
            fillOpacity: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.01,
                hidden: (props) => props.fillColorType !== "brand",
            },
            borderColorType: {
                type: ControlType.Enum,
                defaultValue: "brand",
                options: ["brand", "custom"],
                optionTitles: ["Brand", "Custom"],
                displaySegmentedControl: true,
                title: "Border",
            },
            borderColor: {
                type: ControlType.Color,
                defaultValue: "#FFF",
                hidden: (props) => props.borderColorType !== "custom",
                title: " ",
            },
            borderOpacity: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.01,
                hidden: (props) => props.borderColorType !== "brand",
            },
            iconColorType: {
                type: ControlType.Enum,
                defaultValue: "brand",
                options: ["brand", "custom"],
                optionTitles: ["Brand", "Custom"],
                displaySegmentedControl: true,
                title: "Icon",
            },
            iconColor: {
                type: ControlType.Color,
                defaultValue: "#FFF",
                hidden: (props) => props.iconColorType !== "custom",
                title: " ",
            },
            iconOpacity: {
                type: ControlType.Number,
                defaultValue: 1,
                min: 0,
                max: 1,
                step: 0.01,
                hidden: (props) => props.iconColorType !== "brand",
            },
        },
    },
})
