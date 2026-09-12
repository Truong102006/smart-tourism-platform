import { ArrowRight, MapPin, Sparkle } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import * as THREE from 'three'
import { places } from '@/data/places'

interface DestinationPoint {
  id: string
  name: string
  city: string
  category: string
  slug: string
  lat: number
  lng: number
  position: THREE.Vector3
}

export const HeroGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePlace, setActivePlace] = useState<DestinationPoint | null>(null)
  const [isRotating, setIsRotating] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 18

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Master Group for globe + markers
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    const GLOBE_RADIUS = 6.2

    // 1. Inner core glow sphere
    const coreGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 48, 48)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x051d14,
      transparent: true,
      opacity: 0.85,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    globeGroup.add(coreMesh)

    // 2. Latitude and Longitude Wireframe Grid
    const wireframeGeometry = new THREE.WireframeGeometry(
      new THREE.SphereGeometry(GLOBE_RADIUS, 32, 24)
    )
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    globeGroup.add(wireframe)

    // 3. Dot Matrix / Particle Sphere
    const particleCount = 2400
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const colorEmerald = new THREE.Color(0x34d399)
    const colorGold = new THREE.Color(0xf59e0b)

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi

      const x = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi)
      const y = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi)
      const z = GLOBE_RADIUS * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const mixedColor = Math.random() > 0.8 ? colorGold : colorEmerald
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const particleSphere = new THREE.Points(particleGeometry, particleMaterial)
    globeGroup.add(particleSphere)

    // 4. Ambient Starfield / floating energy embers
    const emberCount = 300
    const emberPositions = new Float32Array(emberCount * 3)
    for (let i = 0; i < emberCount; i++) {
      const dist = 7 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      emberPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta)
      emberPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta)
      emberPositions[i * 3 + 2] = dist * Math.cos(phi)
    }
    const emberGeo = new THREE.BufferGeometry()
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3))
    const emberMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
    const emberPoints = new THREE.Points(emberGeo, emberMat)
    scene.add(emberPoints)

    // 5. Outer atmospheric halo rings
    const ringGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.05, GLOBE_RADIUS * 1.35, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x059669,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
    const atmosphereRing = new THREE.Mesh(ringGeo, ringMat)
    atmosphereRing.rotation.x = Math.PI / 2.5
    globeGroup.add(atmosphereRing)

    // Convert Lat/Lng to Vector3 on Globe
    const convertLatLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const z = radius * Math.sin(phi) * Math.sin(theta)
      const y = radius * Math.cos(phi)
      return new THREE.Vector3(x, y, z)
    }

    // Destination Pin Markers
    const destinations: DestinationPoint[] = places.map((p) => {
      const pos = convertLatLngToVector3(p.coordinates.lat, p.coordinates.lng, GLOBE_RADIUS)
      return {
        id: p.id,
        name: p.name,
        city: p.city,
        category: p.category,
        slug: p.slug,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        position: pos,
      }
    })

    // Create Pin Visuals
    const pinMeshes: THREE.Mesh[] = []
    destinations.forEach((dest) => {
      const pinGroup = new THREE.Group()
      pinGroup.position.copy(dest.position)
      pinGroup.lookAt(0, 0, 0) // Align to surface normal

      // Glowing dot at surface
      const dotGeo = new THREE.SphereGeometry(0.18, 16, 16)
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: false,
      })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.userData = { destination: dest }
      pinMeshes.push(dot)
      pinGroup.add(dot)

      // Light beam pointing outward
      const beamGeo = new THREE.CylinderGeometry(0.02, 0.08, 0.9, 8)
      beamGeo.translate(0, 0.45, 0)
      beamGeo.rotateX(Math.PI / 2)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      pinGroup.add(beam)

      globeGroup.add(pinGroup)
    })

    // Initial orientation to show Southeast Asia / Vietnam prominently
    globeGroup.rotation.y = -1.8
    globeGroup.rotation.x = 0.35

    // Default select first destination for preview
    setActivePlace(destinations[0])

    // Interaction & Animation Loop
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0.35
    let targetRotationY = -1.8
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      previousMousePosition = { x: clientX, y: clientY }
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x
        const deltaY = clientY - previousMousePosition.y

        targetRotationY += deltaX * 0.005
        targetRotationX += deltaY * 0.005
        targetRotationX = Math.max(-0.8, Math.min(0.8, targetRotationX))

        previousMousePosition = { x: clientX, y: clientY }
      } else {
        const rect = container.getBoundingClientRect()
        mouseX = ((clientX - rect.left) / rect.width) * 2 - 1
        mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1)
      }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const domElement = renderer.domElement
    domElement.addEventListener('mousedown', onPointerDown)
    domElement.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)

    // Raycaster for clicking markers
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

      raycaster.setFromCamera(mouseVector, camera)
      const intersects = raycaster.intersectObjects(pinMeshes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const dest = hit.userData.destination as DestinationPoint
        if (dest) {
          setActivePlace(dest)
        }
      }
    }
    domElement.addEventListener('click', onClick)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Auto rotation when idle
      if (!isDragging && isRotating) {
        targetRotationY += 0.0018
      }

      // Smooth damping
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05

      // Subtle mouse hover parallax
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03
      camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      // Gentle floating ember oscillation
      emberPoints.rotation.y = elapsedTime * 0.02
      atmosphereRing.rotation.z = elapsedTime * 0.03

      // Pulse pin dots
      const scale = 1 + Math.sin(elapsedTime * 4) * 0.15
      pinMeshes.forEach((mesh) => {
        mesh.scale.set(scale, scale, scale)
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      domElement.removeEventListener('mousedown', onPointerDown)
      domElement.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchend', onPointerUp)
      domElement.removeEventListener('click', onClick)
      renderer.dispose()
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement)
      }
    }
  }, [isRotating])

  return (
    <div className="hero-globe-outer">
      {/* 3D WebGL Canvas Viewport */}
      <div className="hero-globe-canvas" ref={containerRef} />

      {/* Floating HUD Badge / Coordinates overlay */}
      <div className="globe-hud-pill">
        <div className="globe-live-dot" />
        <span>Tọa độ du lịch Việt Nam 3D</span>
        <button
          type="button"
          className="globe-spin-toggle"
          onClick={() => setIsRotating((prev) => !prev)}
          title={isRotating ? 'Dừng xoay' : 'Tiếp tục xoay'}
        >
          {isRotating ? 'Xoay tự động' : 'Đã tạm dừng'}
        </button>
      </div>

      {/* Selected Destination Card Card Floating Overlay */}
      {activePlace && (
        <div className="globe-card-popover reveal-in">
          <div className="globe-popover-inner">
            <div className="globe-popover-tag">
              <Sparkle size={13} weight="fill" />
              <span>{activePlace.category}</span>
            </div>
            <h4>{activePlace.name}</h4>
            <p className="globe-popover-city">
              <MapPin size={14} weight="fill" /> {activePlace.city} • {activePlace.lat.toFixed(2)}°N, {activePlace.lng.toFixed(2)}°E
            </p>
            <Link
              to={`/dia-diem/${activePlace.slug}`}
              className="globe-popover-cta"
            >
              <span>Chi tiết trải nghiệm</span>
              <div className="btn-icon-circle">
                <ArrowRight size={13} weight="bold" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Location Pills under the Globe */}
      <div className="globe-dest-pills">
        {places.map((p) => {
          const isCurrent = activePlace?.id === p.id
          return (
            <button
              key={p.id}
              type="button"
              className={`globe-dest-btn ${isCurrent ? 'active' : ''}`}
              onClick={() => {
                setActivePlace({
                  id: p.id,
                  name: p.name,
                  city: p.city,
                  category: p.category,
                  slug: p.slug,
                  lat: p.coordinates.lat,
                  lng: p.coordinates.lng,
                  position: new THREE.Vector3(),
                })
              }}
            >
              {p.city}
            </button>
          )
        })}
      </div>
    </div>
  )
}
