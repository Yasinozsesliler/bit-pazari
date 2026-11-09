// swift-tools-version:5.9
// AdMob aracılık (mediation) adaptörleri: Unity Ads ve Liftoff Monetize.
// Capacitor bu dosyayı yönetmez; `npx cap sync` üzerine yazmaz.
import PackageDescription

let package = Package(
    name: "AdMediation",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "AdMediation", targets: ["AdMediation"])
    ],
    dependencies: [
        // Unity Ads adaptörü 4.21.0.0
        .package(url: "https://github.com/googleads/googleads-mobile-ios-mediation-unity.git",
                 revision: "188967a5c062987496cd276b83dc25e84f87d9a6"),
        // Liftoff Monetize (Vungle) adaptörü 7.7.8.0
        .package(url: "https://github.com/googleads/googleads-mobile-ios-mediation-liftoffmonetize.git",
                 revision: "466e63974937e07a38c14c18e93fe92cfc31c567"),
    ],
    targets: [
        .target(
            name: "AdMediation",
            dependencies: [
                .product(name: "UnityAdapterTarget", package: "googleads-mobile-ios-mediation-unity"),
                .product(name: "LiftoffMonetizeAdapterTarget", package: "googleads-mobile-ios-mediation-liftoffmonetize"),
            ]
        )
    ]
)
